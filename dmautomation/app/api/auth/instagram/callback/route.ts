import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/auth/instagram/callback
 * Instagram redirects here after the user approves the app.
 * Exchanges the code for a short-lived token, then a long-lived token,
 * and saves both the token and account ID to Supabase.
 */
export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const dashboardUrl = `${baseUrl}/dashboard/instagram`;

  // ── Get the authorization code from the URL ──────────────────────────────
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    const reason = searchParams.get("error_description") || "Authorization denied.";
    return NextResponse.redirect(`${dashboardUrl}?error=${encodeURIComponent(reason)}`);
  }

  // ── Verify the user is logged in ─────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(`${baseUrl}/login`);
  }

  const appId = process.env.INSTAGRAM_APP_ID!;
  const appSecret = process.env.INSTAGRAM_APP_SECRET!;
  const redirectUri = `${baseUrl}/api/auth/instagram/callback`;

  try {
    // ── Step 1: Exchange code for short-lived token ───────────────────────
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error_type || !tokenData.access_token) {
      console.error("Token exchange error:", tokenData);
      return NextResponse.redirect(
        `${dashboardUrl}?error=${encodeURIComponent(tokenData.error_message || "Token exchange failed")}`
      );
    }

    const shortToken = tokenData.access_token;
    const userId = tokenData.user_id; // Instagram user ID

    // ── Step 2: Exchange for long-lived token (valid 60 days) ────────────
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`
    );
    const longTokenData = await longTokenRes.json();

    const finalToken = longTokenData.access_token || shortToken;

    // ── Step 3: Fetch username ───────────────────────────────────────────
    let username = "";
    try {
      const meRes = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${finalToken}`
      );
      const me = await meRes.json();
      username = me.username || "";
    } catch {
      /* non-fatal */
    }

    // ── Step 4: Save to Supabase ─────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from("users")
      .update({
        ig_access_token: finalToken,
        ig_account_id: String(userId),
        updated_at: new Date().toISOString(),
      })
      .eq("id", (session.user as any).id);

    if (dbError) {
      console.error("Supabase save error:", dbError);
      return NextResponse.redirect(`${dashboardUrl}?error=Failed+to+save+credentials`);
    }

    // ── Success! Redirect back to the Instagram dashboard page ──────────
    return NextResponse.redirect(`${dashboardUrl}?connected=1&username=${encodeURIComponent(username)}`);
  } catch (err) {
    console.error("Instagram OAuth callback error:", err);
    return NextResponse.redirect(`${dashboardUrl}?error=Unexpected+error`);
  }
}
