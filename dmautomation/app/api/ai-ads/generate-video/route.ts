import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import { InferenceClient } from "@huggingface/inference";
import path from "path";
import fs from "fs";

// LTX-Video: fast, high quality, free on HuggingFace Inference API
const HF_VIDEO_MODEL = "Lightricks/LTX-Video";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HF_API_KEY || HF_API_KEY === "your_huggingface_token_here") {
      return NextResponse.json({
        message: "HUGGINGFACE_API_KEY is not set. Get a free token at huggingface.co/settings/tokens",
        status: "failed"
      }, { status: 503 });
    }

    const { projectId, headline } = await req.json();
    if (!headline) return NextResponse.json({ message: "headline/prompt is required", status: "failed" }, { status: 400 });

    const videoPrompt = `${headline}, cinematic product advertisement, smooth motion, high quality, 4K`;
    const jobId = `hf_video_${Date.now()}`;

    // Register in Supabase queue so the polling endpoint can track it
    try {
      if (supabaseAdmin) {
        await supabaseAdmin.from("ai_ad_queue").insert({
          user_id:         (session.user as any).id,
          project_id:      projectId || null,
          job_type:        "video",
          provider:        "huggingface",
          provider_job_id: jobId,
          status:          "processing",
        });
      }
    } catch (dbErr) {
      console.warn("[HF Video] DB insert failed (non-fatal):", dbErr);
    }

    // Fire background generation — this can take 2-5 minutes
    generateVideoBackground(videoPrompt, jobId, projectId, (session.user as any).id, HF_API_KEY);

    return NextResponse.json({
      jobId,
      provider: "huggingface",
      status: "processing",
      pollUrl: `/api/ai-ads/queue?jobId=${jobId}&provider=huggingface&type=video`,
    });
  } catch (err: any) {
    console.error("[generate-video HF]", err);
    return NextResponse.json({ message: err.message ?? "Internal Server Error", status: "failed" }, { status: 500 });
  }
}

async function generateVideoBackground(
  prompt: string,
  jobId: string,
  projectId: string | undefined,
  userId: string,
  apiKey: string
) {
  try {
    console.log("[HF Video] Generating:", prompt.substring(0, 60));

    const client = new InferenceClient(apiKey);

    // textToVideo returns a Blob directly
    const videoBlob = await client.textToVideo({
      model: HF_VIDEO_MODEL,
      inputs: prompt,
    });

    // Save blob as mp4 file to /public/videos/
    const videoDir = path.join(process.cwd(), "public", "videos");
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    const fileName = `${jobId}.mp4`;
    const filePath = path.join(videoDir, fileName);
    const arrayBuffer = await videoBlob.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    const resultUrl = `/videos/${fileName}`;
    console.log("[HF Video] ✅ Done:", resultUrl);

    // Mark queue row as done with result URL
    if (supabaseAdmin) {
      await supabaseAdmin
        .from("ai_ad_queue")
        .update({ status: "done", result_url: resultUrl })
        .eq("provider_job_id", jobId);

      if (projectId) {
        await supabaseAdmin
          .from("ai_ad_projects")
          .update({ video_url: resultUrl, status: "done" })
          .eq("id", projectId);
      }
    }
  } catch (err: any) {
    console.error("[HF Video Background Error]", err.message);
    if (supabaseAdmin) {
      await supabaseAdmin
        .from("ai_ad_queue")
        .update({ status: "failed", error: err.message })
        .eq("provider_job_id", jobId);
    }
  }
}
