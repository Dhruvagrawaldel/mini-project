import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || "autodm_verify_token";

// ─── Webhook Verification (GET) ───────────────────────────────────────────────
// Meta calls this once when you register the webhook URL in the dashboard
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[Webhook] Verification successful");
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// ─── Webhook Event Receiver (POST) ────────────────────────────────────────────
// Meta sends comment events here in real-time
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[Webhook] Received event:", JSON.stringify(body, null, 2));

    // Instagram sends events wrapped in entry array
    const entries = body.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        // We care about "comments" field changes on instagram
        if (change.field !== "comments") continue;

        const value = change.value;
        if (!value) continue;

        const {
          id: commentId,
          text: commentText,
          from,          // { id, username } — who commented
          media: { id: mediaId } = {} as any,
        } = value;

        if (!commentText || !from?.id) continue;

        const commenterId = from.id;
        const commenterUsername = from.username || "";

        console.log(`[Webhook] Comment from @${commenterUsername}: "${commentText}" on media ${mediaId}`);

        // ── Find all active automations that match this comment ───────────────
        // We need to find the user who owns this IG account + their automations
        const { data: users } = await supabaseAdmin
          .from("users")
          .select("id, ig_access_token, ig_account_id")
          .not("ig_access_token", "is", null)
          .not("ig_account_id", "is", null);

        if (!users?.length) continue;

        for (const user of users) {
          // Check if this webhook is for this user's IG account
          // (In production, each user's webhook is separate — this handles shared webhook endpoints)
          if (user.ig_account_id !== String(entry.id)) {
            continue;
          }
          
          const { data: automations } = await supabaseAdmin
            .from("automations")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .eq("trigger_type", "comment_keyword");

          if (!automations?.length) continue;

          for (const automation of automations) {
            // Check post targeting
            const targetAll = !automation.post_id || automation.post_id === "all";
            const targetMatch = targetAll || automation.post_id === mediaId;
            if (!targetMatch) continue;

            // Check keyword match
            const keywords: string[] = Array.isArray(automation.keywords)
              ? automation.keywords
              : (automation.keywords || "").split(",").map((k: string) => k.trim().toLowerCase());

            const commentLower = commentText.toLowerCase();
            const matched = keywords.some(kw => kw && commentLower.includes(kw));
            if (!matched) continue;

            console.log(`[Webhook] Keyword matched! Automation: "${automation.name}" → sending DM to ${commenterUsername}`);

            // ── Send the DM ─────────────────────────────────────────────────
            try {
              await sendDM({
                token: user.ig_access_token,
                igAccountId: user.ig_account_id,
                commentId: commentId,
                message: automation.response_message || "Thanks for commenting! 🙌",
              });

              // Log the triggered automation
              await supabaseAdmin.from("automation_logs").insert([{
                automation_id: automation.id,
                user_id:       user.id,
                commenter_id:  commenterId,
                commenter_username: commenterUsername,
                comment_text:  commentText,
                media_id:      mediaId,
                status:        "sent",
                triggered_at:  new Date().toISOString(),
              }]).select().single().then(() => {}).catch(() => {});

            } catch (dmErr: any) {
              console.error("[Webhook] DM send failed:", dmErr.message);

              await supabaseAdmin.from("automation_logs").insert([{
                automation_id: automation.id,
                user_id:       user.id,
                commenter_id:  commenterId,
                commenter_username: commenterUsername,
                comment_text:  commentText,
                media_id:      mediaId,
                status:        "failed",
                error:         dmErr.message,
                triggered_at:  new Date().toISOString(),
              }]).select().single().then(() => {}).catch(() => {});
            }

            break; // Only one automation per comment
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("[Webhook] Error:", err);
    // Always return 200 to Meta so they don't keep retrying
    return NextResponse.json({ status: "error", message: err.message }, { status: 200 });
  }
}

// ─── Send Instagram DM ─────────────────────────────────────────────────────────
async function sendDM({ token, igAccountId, commentId, message }: {
  token: string;
  igAccountId: string;
  commentId: string;
  message: string;
}) {
  const url = `https://graph.facebook.com/v21.0/me/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      recipient: { comment_id: commentId },
      message:   { text: message },
    }),
  });


  const data = await res.json();

  if (data.error) {
    throw new Error(`Instagram DM error: ${data.error.message} (code ${data.error.code})`);
  }

  return data;
}
