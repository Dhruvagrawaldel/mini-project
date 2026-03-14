import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const { data: automation, error } = await supabaseAdmin
      .from("automations")
      .update({ ...body })
      .eq("id", id)
      .eq("user_id", (session.user as any).id)
      .select()
      .single();

    if (error) throw error;

    if (!automation) {
      return NextResponse.json({ message: "Automation not found" }, { status: 404 });
    }

    return NextResponse.json(automation);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("automations")
      .delete()
      .eq("id", id)
      .eq("user_id", (session.user as any).id);

    if (error) throw error;

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
