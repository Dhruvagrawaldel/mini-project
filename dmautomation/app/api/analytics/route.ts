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

    const userId = (session.user as any).id;

    // 1. Summary Stats
    const { count: totalSent } = await supabaseAdmin
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "sent");

    const { count: totalFailed } = await supabaseAdmin
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "failed");

    const { count: activeRules } = await supabaseAdmin
      .from("automations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true);

    // 2. Chart data: last 7 days of logs
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const { count } = await supabaseAdmin
        .from("logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "sent")
        .gte("created_at", date.toISOString())
        .lt("created_at", nextDate.toISOString());

      last7Days.push({
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        dms: count || 0,
        comments: (count || 0) + (Math.floor(Math.random() * 5)), // Simulation for visuals
      });
    }

    return NextResponse.json({
      summary: {
        totalSent: totalSent || 0,
        totalFailed: totalFailed || 0,
        activeRules: activeRules || 0,
        hoursSaved: Math.round(((totalSent || 0) * 3) / 60),
      },
      chartData: last7Days,
    });
  } catch (error: any) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
