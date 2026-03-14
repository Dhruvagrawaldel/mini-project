import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("name, email, ig_account_id, ig_access_token")
      .eq("id", (session.user as any).id)
      .single();

    if (error) throw error;

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, ig_account_id, ig_access_token } = await req.json();

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .update({
        name,
        ig_account_id,
        ig_access_token,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (session.user as any).id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Profile API Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
