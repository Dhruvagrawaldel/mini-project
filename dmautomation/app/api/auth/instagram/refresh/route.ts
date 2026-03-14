import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import axios from "axios";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("ig_access_token")
      .eq("id", (session.user as any).id)
      .single();

    if (error || !user?.ig_access_token) {
      return NextResponse.json({ message: "No token found to refresh" }, { status: 400 });
    }

    const res = await axios.get(
      `https://graph.instagram.com/refresh_access_token`,
      {
        params: {
          grant_type: "ig_refresh_token",
          access_token: user.ig_access_token,
        },
      }
    );

    const newToken = res.data.access_token;

    await supabaseAdmin
      .from("users")
      .update({
        ig_access_token: newToken,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (session.user as any).id);

    return NextResponse.json({ success: true, message: "Token refreshed successfully" });
  } catch (error: any) {
    console.error("IG Refresh Error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.error?.message || "Failed to refresh token" },
      { status: 500 }
    );
  }
}
