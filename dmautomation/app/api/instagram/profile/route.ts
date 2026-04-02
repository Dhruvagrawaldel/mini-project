import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/instagram/profile
 * Returns the connected user's Instagram profile picture and username.
 * Tries Instagram Basic Display API first, then Facebook Graph API.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("ig_access_token, ig_account_id")
      .eq("id", (session.user as any).id)
      .single();

    if (!user?.ig_access_token || !user?.ig_account_id) {
      return NextResponse.json({ connected: false });
    }

    const { ig_access_token: token, ig_account_id: accountId } = user;

    // ── Strategy 1: Instagram Basic Display API ────────────────────────────
    try {
      const res  = await fetch(
        `https://graph.instagram.com/me?fields=id,username,profile_picture_url&access_token=${token}`
      );
      const data = await res.json();

      if (!data.error && data.id) {
        return NextResponse.json({
          connected: true,
          username:   data.username || "",
          profilePic: data.profile_picture_url || null,
          accountId:  data.id,
        });
      }
    } catch { /* fall through */ }

    // ── Strategy 2: Facebook Graph API (Business token) ────────────────────
    try {
      const res  = await fetch(
        `https://graph.facebook.com/${accountId}?fields=username,profile_picture_url,name&access_token=${token}`
      );
      const data = await res.json();

      if (!data.error) {
        return NextResponse.json({
          connected: true,
          username:   data.username || data.name || "",
          profilePic: data.profile_picture_url || null,
          accountId,
        });
      }
    } catch { /* fall through */ }

    return NextResponse.json({ connected: true, username: "", profilePic: null, accountId });
  } catch (err) {
    console.error("IG profile error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
