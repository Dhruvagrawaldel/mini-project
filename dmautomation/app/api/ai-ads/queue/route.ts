import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const RUNWAY_SECRET   = process.env.RUNWAY_API_SECRET;
const PIKA_API_KEY    = process.env.PIKA_API_KEY;

/* ────────────────────────────────────────────────────────
   QUEUE POLLER  GET /api/ai-ads/queue?jobId=...&provider=...&type=image|video
   ──────────────────────────────────────────────────────── */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const jobId    = searchParams.get("jobId");
    const provider = searchParams.get("provider") ?? "replicate";
    const type     = searchParams.get("type") ?? "image";

    if (!jobId) return NextResponse.json({ message: "jobId is required" }, { status: 400 });

    let status = "processing";
    let resultUrl: string | null = null;

    /* ── Local poller (reads from DB because it runs in background) ── */
    if (provider === "huggingface" || provider === "ffmpeg") {
      if (supabaseAdmin) {
        const { data: q } = await supabaseAdmin.from("ai_ad_queue").select("status, result_url").eq("provider_job_id", jobId).single();
        if (q) {
          status    = q.status;
          resultUrl = q.result_url;
        }
      }
      return NextResponse.json({ jobId, status, resultUrl });
    }

    /* ── Replicate polling ── */
    if (provider === "replicate" || provider === "replicate_svd") {
      const res = await fetch(`https://api.replicate.com/v1/predictions/${jobId}`, {
        headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
      });
      const data = await res.json();

      if (data.status === "succeeded") {
        status    = "done";
        resultUrl = Array.isArray(data.output) ? data.output[0] : data.output;
      } else if (data.status === "failed" || data.status === "canceled") {
        status = "failed";
      } else {
        status = "processing";
      }
    }

    /* ── Runway polling ── */
    if (provider === "runway") {
      const res = await fetch(`https://api.runwayml.com/v1/tasks/${jobId}`, {
        headers: {
          Authorization: `Bearer ${RUNWAY_SECRET}`,
          "X-Runway-Version": "2024-11-06",
        },
      });
      const data = await res.json();
      if (data.status === "SUCCEEDED") { status = "done"; resultUrl = data.output?.[0]; }
      else if (data.status === "FAILED") { status = "failed"; }
    }

    /* ── Pika polling ── */
    if (provider === "pika") {
      const res = await fetch(`https://api.pika.art/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${PIKA_API_KEY}` },
      });
      const data = await res.json();
      if (data.status === "finished") { status = "done"; resultUrl = data.resultUrl; }
      else if (data.status === "failed") { status = "failed"; }
    }

    /* ── Pixazo polling ── */
    if (provider === "pixazo") {
      const PIXAZO_API_KEY = process.env.PIXAZO_API_KEY;
      // Correct: gateway.pixazo.ai with Ocp-Apim-Subscription-Key header
      const res = await fetch(
        `https://gateway.pixazo.ai/p-video/v1/p-video/getGenerationResults?predictionId=${jobId}`,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": PIXAZO_API_KEY ?? "",
            "Cache-Control": "no-cache",
          },
        }
      );
      const data = await res.json();
      console.log("[Pixazo Poll]", res.status, JSON.stringify(data).substring(0, 300));
      
      const resStatus = (data.status ?? data.state ?? "").toLowerCase();
      if (resStatus === "succeeded" || resStatus === "completed" || resStatus === "done") { 
        status = "done"; 
        resultUrl = data.url || data.video_url || data.result_url || data.output || data.videoUrl; 
      }
      else if (resStatus === "failed" || resStatus === "error") { 
        status = "failed"; 
      }
      else { 
        status = "processing"; 
      }
    }

    /* ── Update Supabase queue row ── */
    if (supabaseAdmin && (status === "done" || status === "failed")) {
      const { data: queueRow } = await supabaseAdmin
        .from("ai_ad_queue")
        .update({ status, result_url: resultUrl })
        .eq("provider_job_id", jobId)
        .select("project_id, job_type")
        .single();

      // Reflect result back on the project row
      if (queueRow?.project_id && status === "done") {
        const column = queueRow.job_type === "video" ? "video_url" : "ad_image_url";
        await supabaseAdmin
          .from("ai_ad_projects")
          .update({ [column]: resultUrl, status: "done" })
          .eq("id", queueRow.project_id);
      }
    }

    return NextResponse.json({ jobId, status, resultUrl });
  } catch (err: any) {
    console.error("[ai-ads/queue GET]", err);
    return NextResponse.json({ message: err.message ?? "Internal Server Error" }, { status: 500 });
  }
}

/* ────────────────────────────────────────────────────────
   PROJECTS CRUD
   GET  /api/ai-ads/queue?projects=1   → list user's projects
   POST /api/ai-ads/queue              → create project
   PUT  /api/ai-ads/queue              → update project
   ──────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const userId = (session.user as any).id;

    if (!supabaseAdmin) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });

    const { data, error } = await supabaseAdmin
      .from("ai_ad_projects")
      .insert({
        user_id:     userId,
        name:        body.name ?? "Untitled Ad",
        status:      "pending",
        platform:    body.platform ?? [],
        tone:        body.tone ?? "professional",
        audience:    body.audience ?? {},
        product_url: body.productUrl ?? null,
        image_url:   body.imageUrl ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("[ai-ads/queue POST]", err);
    return NextResponse.json({ message: err.message ?? "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body    = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });

    if (!supabaseAdmin) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });

    const { data, error } = await supabaseAdmin
      .from("ai_ad_projects")
      .update(fields)
      .eq("id", id)
      .eq("user_id", (session.user as any).id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[ai-ads/queue PUT]", err);
    return NextResponse.json({ message: err.message ?? "Internal Server Error" }, { status: 500 });
  }
}
