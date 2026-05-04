import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/instagram/connect
 * Body: { token: string }
 *
 * Accepts EITHER:
 *  - Instagram Basic Display token  (from Meta App → Instagram Basic Display → Token Generator)
 *  - Facebook User Access Token     (from Graph API Explorer with instagram permissions)
 *
 * Auto-detects account ID and username, saves to Supabase.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token || typeof token !== "string" || token.trim().length < 10) {
      return NextResponse.json({ message: "A valid access token is required." }, { status: 400 });
    }

    const t = token.trim();
    let accountId = "";
    let username   = "";

    // ── Strategy 1: Instagram Basic Display API ───────────────────────────────
    // Works with tokens from: Meta App → Instagram Basic Display → Token Generator
    try {
      const igRes  = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${t}`);
      const igData = await igRes.json();
      console.log("Instagram Basic API response:", igData);

      if (!igData.error && igData.id) {
        accountId = igData.id;
        username  = igData.username || "";
        console.log("Detected IG Basic account:", { accountId, username });
      }
    } catch (err) {
      console.error("IG Basic API error:", err);
    }

    // ── Strategy 2: Facebook Graph API (Business / User Token) ────────────────
    // Works with tokens from: Graph API Explorer with instagram_basic or
    //   instagram_manage_messages / instagram_manage_contents permissions
    if (!accountId) {
      try {
        // Try direct Facebook /me (for user access tokens)
        const fbRes  = await fetch(`https://graph.facebook.com/me?fields=id,name&access_token=${t}`);
        const fbData = await fbRes.json();
        console.log("Facebook /me response:", fbData);

        if (!fbData.error && fbData.id) {
          // Get connected Facebook Pages → each Page has an instagram_business_account
          const pagesRes  = await fetch(
            `https://graph.facebook.com/me/accounts?fields=instagram_business_account{id,username}&access_token=${t}`
          );
          const pagesData = await pagesRes.json();
          console.log("Facebook Pages response:", pagesData);

          // Pick the first page that has an IG account linked
          const igAccount = pagesData.data
            ?.map((p: any) => p.instagram_business_account)
            .find((ig: any) => ig?.id);

          if (igAccount) {
            accountId = igAccount.id;
            username  = igAccount.username || "";
            console.log("Detected IG Business account via Pages:", { accountId, username });
          } else {
            console.log("No IG account in Pages. Trying direct IG Biz field...");
            // Fallback: try the token as if it's a Page token with IG Business
            const bizRes  = await fetch(
              `https://graph.facebook.com/me?fields=instagram_business_account{id,username}&access_token=${t}`
            );
            const bizData = await bizRes.json();
            console.log("Direct IG Biz field response:", bizData);
            if (bizData.instagram_business_account?.id) {
              accountId = bizData.instagram_business_account.id;
              username  = bizData.instagram_business_account.username || "";
            }
          }
        }
      } catch (err) {
        console.error("FB Strategy error:", err);
      }
    }

    if (!accountId) {
      return NextResponse.json(
        {
          message:
            "Could not read your Instagram account from this token. " +
            "Make sure the token has instagram_basic or instagram_manage_messages permissions.",
        },
        { status: 400 }
      );
    }

    // ── Save to Supabase ──────────────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from("users")
      .update({
        ig_access_token: t,
        ig_account_id:   accountId,
        updated_at:      new Date().toISOString(),
      })
      .eq("id", (session.user as any).id);

    if (dbError) {
      console.error("Supabase update error:", dbError);
      return NextResponse.json({ message: "Failed to save credentials." }, { status: 500 });
    }

    return NextResponse.json({ success: true, accountId, username });
  } catch (err: any) {
    console.error("Instagram connect error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
