import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
// Using SDXL or Flux on Hugging Face Serverless Inference API
const HF_MODEL = "stabilityai/stable-diffusion-xl-base-1.0"; 

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!HF_API_KEY) {
      return NextResponse.json({ message: "HUGGINGFACE_API_KEY not configured in .env.local" }, { status: 503 });
    }

    const { projectId, productDescription, tone, headline, platform } = await req.json();
    if (!productDescription) return NextResponse.json({ message: "productDescription is required" }, { status: 400 });

    const toneStyle: Record<string, string> = {
      professional: "clean minimalist studio ad, professional lighting, corporate",
      emotional:    "warm authentic lifestyle photography, natural light, candid",
      funny:        "vibrant bold colours, playful composition, eye-catching",
      luxury:       "dark dramatic lighting, premium materials, high-end fashion editorial",
    };

    const prompt = `Product advertisement photo: ${productDescription}. 
${headline ? `Ad headline concept: "${headline}". ` : ""}
Style: ${toneStyle[tone] ?? toneStyle.professional}. 
High resolution commercial photography, perfect for ${platform ?? "social media"} ads, 
professional product placement, marketing campaign visual, 8K quality.`;

    // Queue the job initially
    let queueJobId = `hf_${Date.now()}`;
    if (supabaseAdmin && projectId) {
      await supabaseAdmin.from("ai_ad_queue").insert({
        project_id:      projectId,
        user_id:         (session.user as any).id,
        job_type:        "image",
        provider:        "huggingface",
        provider_job_id: queueJobId,
        status:          "processing",
      });
    }

    // Call Hugging Face API — usually synchronous but can take 10-30 seconds if cold
    // We intentionally don't await this so the UI can proceed to poll, 
    // simulating async background processing like Replicate does.
    processBackgroundJob(prompt, queueJobId, projectId, (session.user as any).id);

    return NextResponse.json({
      jobId:      queueJobId,
      status:     "starting",
      pollUrl:    `/api/ai-ads/queue?jobId=${queueJobId}&type=image`,
    });
  } catch (err: any) {
    console.error("[ai-ads/generate-image]", err);
    return NextResponse.json({ message: err.message ?? "Internal Server Error" }, { status: 500 });
  }
}

async function processBackgroundJob(prompt: string, jobId: string, projectId: string, userId: string) {
  try {
    const res = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Hugging Face error]", err);
      throw new Error(`HF API failed: ${err}`);
    }

    // Convert raw image blob to base64 Data URL so we can save it directly
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const resultUrl = `data:image/jpeg;base64,${base64}`;

    if (supabaseAdmin) {
      // Update queue to 'done'
      await supabaseAdmin
        .from("ai_ad_queue")
        .update({ status: "done", result_url: resultUrl })
        .eq("provider_job_id", jobId);

      // Update project with the final image
      if (projectId) {
        await supabaseAdmin
          .from("ai_ad_projects")
          .update({ ad_image_url: resultUrl, status: "done" })
          .eq("id", projectId);
      }
    }
  } catch (error) {
    console.error("Background job failed:", error);
    if (supabaseAdmin) {
      await supabaseAdmin
        .from("ai_ad_queue")
        .update({ status: "failed", error: String(error) })
        .eq("provider_job_id", jobId);
    }
  }
}
