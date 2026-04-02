import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/instagram/connect
 * Body: { token: string }
 *
 * Validates the token, auto-fetches the Instagram account ID,
 * then saves both to the user's profile in Supabase.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token || typeof token !== "string" || token.trim().length < 10) {
      return NextResponse.json({ message: "A valid access token is required." }, { status: 400 });
    }

    // ── Step 1: Auto-fetch account ID & username from Instagram ──────────────
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${token.trim()}`
    );
    const meData = await meRes.json();

    if (meData.error) {
      return NextResponse.json(
        { message: `Instagram error: ${meData.error.message}` },
        { status: 400 }
      );
    }

    const accountId = meData.id;
    const username = meData.username || "";

    if (!accountId) {
      return NextResponse.json(
        { message: "Could not retrieve account ID from this token." },
        { status: 400 }
      );
    }

    // ── Step 2: Save to Supabase ─────────────────────────────────────────────
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        ig_access_token: token.trim(),
        ig_account_id: accountId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (session.user as any).id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json({ message: "Failed to save credentials." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      accountId,
      username,
    });
  } catch (err: any) {
    console.error("Instagram connect error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
