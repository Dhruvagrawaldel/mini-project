import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!supabaseAdmin) return NextResponse.json([], { status: 200 });

    const { data, error } = await supabaseAdmin
      .from("ai_ad_projects")
      .select("id, name, status, platform, tone, image_url, ad_image_url, video_url, created_at")
      .eq("user_id", (session.user as any).id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err: any) {
    console.error("[ai-ads/projects]", err);
    return NextResponse.json({ message: err.message ?? "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "id required" }, { status: 400 });

    if (!supabaseAdmin) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });

    const { error } = await supabaseAdmin
      .from("ai_ad_projects")
      .delete()
      .eq("id", id)
      .eq("user_id", (session.user as any).id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[ai-ads/projects DELETE]", err);
    return NextResponse.json({ message: err.message ?? "Internal Server Error" }, { status: 500 });
  }
}
