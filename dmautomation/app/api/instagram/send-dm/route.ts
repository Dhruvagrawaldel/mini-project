import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/instagram/send-dm
 * Body: { recipientId: string; message: string }
 *
 * Sends a direct message to an Instagram user on behalf of the logged-in user.
 * Uses the token stored in Supabase.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { recipientId, message } = await req.json();

    if (!recipientId || !message) {
      return NextResponse.json({ message: "recipientId and message are required" }, { status: 400 });
    }

    // Get user's stored IG credentials
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("ig_access_token, ig_account_id")
      .eq("id", (session.user as any).id)
      .single();

    if (!user?.ig_access_token || !user?.ig_account_id) {
      return NextResponse.json({ message: "Instagram account not connected" }, { status: 400 });
    }

    // ✅ Use ig_account_id in the URL path — /me/messages is FB Messenger only
    const res = await fetch(`https://graph.facebook.com/v21.0/${user.ig_account_id}/messages?access_token=${user.ig_access_token}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message:   { text: message },
      }),
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({
        message: data.error.message,
        code: data.error.code,
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, messageId: data.message_id });
  } catch (err: any) {
    console.error("Send DM error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
