import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import Replicate from "replicate";

// minimax/video-01 — works on free Replicate tier (rate-limited to 1 burst/min)
// Properly handles 429 with retry-after so the UI can auto-retry
const VIDEO_MODEL = "minimax/video-01";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { message: "REPLICATE_API_TOKEN is not set in .env.local", status: "failed" },
        { status: 503 }
      );
    }

    const { projectId, headline } = await req.json();
    if (!headline)
      return NextResponse.json(
        { message: "headline/prompt is required", status: "failed" },
        { status: 400 }
      );

    const prompt = `${headline}, cinematic product advertisement, high quality, smooth motion, professional`;
    const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });

    console.log(`\n[Replicate Video] ── Creating prediction ──`);
    console.log(`[Replicate Video] Model:  ${VIDEO_MODEL}`);
    console.log(`[Replicate Video] Prompt: ${prompt.substring(0, 100)}`);

    let prediction;
    try {
      prediction = await replicate.predictions.create({
        model: VIDEO_MODEL,
        input: {
          prompt,
          prompt_optimizer: true,
        },
      });
    } catch (err: any) {
      const msg = err.message ?? "";
      console.error("[Replicate Video] predictions.create failed:", msg);

      // Parse retry_after from 429 response
      const is429 = msg.includes("429") || msg.includes("Too Many Requests") || msg.includes("throttled");
      if (is429) {
        // Try to extract retry_after from the error JSON string
        const retryMatch = msg.match(/"retry_after"\s*:\s*(\d+)/);
        const retryAfter = retryMatch ? parseInt(retryMatch[1], 10) : 15;
        console.warn(`[Replicate Video] Rate limited — retry after ${retryAfter}s`);
        return NextResponse.json(
          { message: `Rate limited by Replicate. Retrying in ${retryAfter}s...`, status: "rate_limited", retryAfter },
          { status: 429 }
        );
      }

      const is402 = msg.includes("402") || msg.includes("Insufficient credit") || msg.includes("Payment Required");
      if (is402) {
        return NextResponse.json(
          { message: "Insufficient Replicate credits. Please add credits at replicate.com/account/billing", status: "failed" },
          { status: 402 }
        );
      }

      throw err; // re-throw anything else
    }

    console.log(`[Replicate Video] ✅ Prediction created: ${prediction.id} (status: ${prediction.status})`);
    const jobId = prediction.id;

    // Register in Supabase (non-fatal)
    try {
      if (supabaseAdmin) {
        await supabaseAdmin.from("ai_ad_queue").insert({
          user_id:         (session.user as any).id,
          project_id:      projectId || null,
          job_type:        "video",
          provider:        "replicate",
          provider_job_id: jobId,
          status:          "processing",
        });
        console.log(`[Replicate Video] ✅ Registered in Supabase queue`);
      }
    } catch (dbErr) {
      console.warn("[Replicate Video] DB insert failed (non-fatal):", dbErr);
    }

    return NextResponse.json({
      jobId,
      provider: "replicate",
      status:   "processing",
      pollUrl:  `/api/ai-ads/queue?jobId=${jobId}&provider=replicate&type=video`,
    });

  } catch (err: any) {
    console.error("[generate-video Replicate] Unhandled error:", err.message);
    return NextResponse.json(
      { message: err.message ?? "Internal Server Error", status: "failed" },
      { status: 500 }
    );
  }
}
