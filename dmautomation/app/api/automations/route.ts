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

    const { data: automations, error } = await supabaseAdmin
      .from("automations")
      .select("*")
      .eq("user_id", (session.user as any).id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(automations);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, keywords, response_message, post_id, is_ai_enabled, brand_tone, goal } = await req.json();

    if (!name || !keywords) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const keywordsArray = Array.isArray(keywords) 
      ? keywords 
      : keywords.split(",").map((k: string) => k.trim());

    const { data: automation, error } = await supabaseAdmin
      .from("automations")
      .insert([
        {
          user_id: (session.user as any).id,
          name,
          keywords: keywordsArray,
          response_message: response_message || "",
          post_id: post_id || "all",
          is_active: true,
          is_ai_enabled: !!is_ai_enabled,
          brand_tone: brand_tone || "Friendly",
          goal: goal || "Move to DM",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(automation, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
