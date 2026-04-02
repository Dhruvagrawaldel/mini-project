import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import Replicate from "replicate";

// FLUX Schnell — fast, high-quality image generation on Replicate
const IMAGE_MODEL = "black-forest-labs/flux-schnell";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { message: "REPLICATE_API_TOKEN is not configured in .env.local" },
        { status: 503 }
      );
    }

    const { projectId, productDescription, tone, headline, platform } = await req.json();
    if (!productDescription)
      return NextResponse.json({ message: "productDescription is required" }, { status: 400 });

    const toneStyle: Record<string, string> = {
      professional: "clean minimalist studio ad, professional lighting, corporate",
      emotional:    "warm authentic lifestyle photography, natural light, candid",
      funny:        "vibrant bold colours, playful composition, eye-catching",
      luxury:       "dark dramatic lighting, premium materials, high-end fashion editorial",
    };

    const prompt = `Product advertisement photo: ${productDescription}. ${
      headline ? `Ad headline concept: "${headline}". ` : ""
    }Style: ${toneStyle[tone] ?? toneStyle.professional}. High resolution commercial photography, perfect for ${
      platform ?? "social media"
    } ads, professional product placement, marketing campaign visual, 8K quality.`;

    const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });

    console.log(`\n[Replicate Image] ── Creating prediction ──`);
    console.log(`[Replicate Image] Model:  ${IMAGE_MODEL}`);
    console.log(`[Replicate Image] Prompt: ${prompt.substring(0, 100)}`);

    // Async prediction — returns instantly with a prediction ID
    const prediction = await replicate.predictions.create({
      model: IMAGE_MODEL,
      input: {
        prompt,
        num_outputs:         1,
        aspect_ratio:        "1:1",
        output_format:       "jpg",
        output_quality:      90,
        num_inference_steps: 4,
      },
    });

    console.log(`[Replicate Image] ✅ Prediction created: ${prediction.id} (status: ${prediction.status})`);

    const jobId = prediction.id;

    // Register in Supabase (non-fatal if it fails)
    try {
      if (supabaseAdmin && projectId) {
        await supabaseAdmin.from("ai_ad_queue").insert({
          project_id:      projectId,
          user_id:         (session.user as any).id,
          job_type:        "image",
          provider:        "replicate",
          provider_job_id: jobId,
          status:          "processing",
        });
      }
    } catch (dbErr) {
      console.warn("[Replicate Image] DB insert failed (non-fatal):", dbErr);
    }

    return NextResponse.json({
      jobId,
      status:  "processing",
      pollUrl: `/api/ai-ads/queue?jobId=${jobId}&provider=replicate&type=image`,
    });
  } catch (err: any) {
    console.error("[generate-image Replicate]", err);
    return NextResponse.json({ message: err.message ?? "Internal Server Error" }, { status: 500 });
  }
}
