import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    return new Response(challenge, { status: 200 });
  } else {
    return new Response("Forbidden", { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object === "instagram") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === "comments") {
            const { value } = change;
            const commentText = value.text.toLowerCase();
            const commentId = value.id;
            const mediaId = value.media.id;
            const fromId = value.from.id;
            const igAccountId = entry.id;

            // 1. Find the user/business account in our DB
            const { data: user } = await supabaseAdmin
              .from("users")
              .select("*")
              .eq("ig_account_id", igAccountId)
              .single();

            if (!user || !user.ig_access_token) continue;

            // 2. Find matching automation rules
            // Supabase filter for OR condition or keywords array contains...
            // PostgreSQL keywords @> ARRAY['word']
            const { data: automations } = await supabaseAdmin
              .from("automations")
              .select("*")
              .eq("user_id", user.id)
              .eq("is_active", true);

            if (!automations) continue;

            for (const automation of automations) {
              // Filters for mediaId match or 'all'
              if (automation.post_id !== "all" && automation.post_id !== mediaId) continue;

              const matches = automation.keywords.some((keyword: string) =>
                commentText.includes(keyword.toLowerCase())
              );

              if (matches) {
                try {
                  // 3. Send the DM via Instagram Graph API
                  await axios.post(
                    `https://graph.facebook.com/v19.0/me/messages`,
                    {
                      recipient: { id: fromId },
                      message: { text: automation.response_message },
                    },
                    {
                      params: { access_token: user.ig_access_token },
                    }
                  );

                  // 4. Log the success
                  await supabaseAdmin.from("logs").insert([
                    {
                      automation_id: automation.id,
                      user_id: user.id,
                      comment_id: commentId,
                      commenter_username: value.from.username || "unknown",
                      status: "sent",
                    },
                  ]);

                  console.log(`Successfully sent DM to ${fromId} for comment ${commentId}`);
                } catch (dmError: any) {
                  console.error("Error sending DM:", dmError.response?.data || dmError.message);
                  
                  // Log the failure
                  await supabaseAdmin.from("logs").insert([
                    {
                      automation_id: automation.id,
                      user_id: user.id,
                      comment_id: commentId,
                      commenter_username: value.from.username || "unknown",
                      status: "failed",
                    },
                  ]);
                }
              }
            }
          }
        }
      }
      return NextResponse.json({ status: "ok" });
    }

    return NextResponse.json({ message: "Not an instagram object" }, { status: 400 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
