import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import path from "path";
import fs from "fs";

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

/* ────────────────────────────────────────────────────────
   QUEUE POLLER  GET /api/ai-ads/queue?jobId=...&provider=replicate&type=image|video
   ──────────────────────────────────────────────────────── */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const jobId    = searchParams.get("jobId");
    const provider = searchParams.get("provider") ?? "replicate";
    const type     = searchParams.get("type") ?? "video";

    if (!jobId) return NextResponse.json({ message: "jobId is required" }, { status: 400 });

    /* ── Check if already resolved in Supabase (cache) ── */
    if (supabaseAdmin) {
      const { data: cached } = await supabaseAdmin
        .from("ai_ad_queue")
        .select("status, result_url")
        .eq("provider_job_id", jobId)
        .single();

      if (cached?.status === "done") {
        console.log(`[Queue Poll] ✅ Cache hit — jobId=${jobId} status=done`);
        return NextResponse.json({ jobId, status: "done", resultUrl: cached.result_url });
      }
      if (cached?.status === "failed") {
        console.log(`[Queue Poll] ❌ Cache hit — jobId=${jobId} status=failed`);
        return NextResponse.json({ jobId, status: "failed", resultUrl: null });
      }
    }

    /* ── Poll Replicate Predictions API directly ── */
    if (!REPLICATE_TOKEN) {
      return NextResponse.json({ jobId, status: "failed", message: "REPLICATE_API_TOKEN not set" });
    }

    const repRes = await fetch(`https://api.replicate.com/v1/predictions/${jobId}`, {
      headers: {
        Authorization: `Token ${REPLICATE_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!repRes.ok) {
      const errBody = await repRes.text();
      console.error(`[Queue Poll] Replicate API error ${repRes.status}:`, errBody);
      return NextResponse.json({ jobId, status: "processing" }); // treat as still running
    }

    const prediction = await repRes.json();
    console.log(`[Queue Poll] jobId=${jobId} replicate_status=${prediction.status} model=${prediction.model ?? "unknown"}`);

    /* ── Still running ── */
    if (prediction.status === "starting" || prediction.status === "processing") {
      return NextResponse.json({ jobId, status: "processing" });
    }

    /* ── Failed or cancelled ── */
    if (prediction.status === "failed" || prediction.status === "canceled") {
      console.error(`[Queue Poll] ❌ Replicate job ${prediction.status}:`, prediction.error);
      if (supabaseAdmin) {
        await supabaseAdmin
          .from("ai_ad_queue")
          .update({ status: "failed", error: prediction.error ?? prediction.status })
          .eq("provider_job_id", jobId);
      }
      return NextResponse.json({ jobId, status: "failed", message: prediction.error ?? "Replicate job failed" });
    }

    /* ── Succeeded ── */
    if (prediction.status === "succeeded") {
      console.log(`[Queue Poll] 🎉 Replicate succeeded! Output:`, JSON.stringify(prediction.output).substring(0, 200));

      // Extract URL from output (varies by model)
      let replicateUrl: string | null = null;
      const out = prediction.output;
      if (typeof out === "string") {
        replicateUrl = out;
      } else if (Array.isArray(out) && out.length > 0) {
        const first = out[0];
        // Some models return FileOutput objects with a url() method (replicate SDK)
        replicateUrl = typeof first === "string" ? first : String(first);
      }

      if (!replicateUrl) {
        console.error("[Queue Poll] ❌ No URL in output:", out);
        return NextResponse.json({ jobId, status: "failed", message: "No output URL from Replicate" });
      }

      // Download file and save locally (runs inside a real request — safe)
      let resultUrl = replicateUrl; // fallback: use Replicate URL directly
      try {
        const ext       = type === "image" ? "jpg" : "mp4";
        const subDir    = type === "image" ? "ad-images" : "videos";
        const fileDir   = path.join(process.cwd(), "public", subDir);
        if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

        const fileName  = `${jobId}.${ext}`;
        const filePath  = path.join(fileDir, fileName);
        const dlRes     = await fetch(replicateUrl);

        if (dlRes.ok) {
          const buf = await dlRes.arrayBuffer();
          fs.writeFileSync(filePath, Buffer.from(buf));
          resultUrl = `/${subDir}/${fileName}`;
          console.log(`[Queue Poll] 💾 Saved ${(buf.byteLength / 1024).toFixed(1)} KB → ${resultUrl}`);
        } else {
          console.warn(`[Queue Poll] Download failed (${dlRes.status}) — using Replicate URL directly`);
        }
      } catch (dlErr: any) {
        console.warn("[Queue Poll] Download error — using Replicate URL directly:", dlErr.message);
      }

      // Update Supabase with final result
      if (supabaseAdmin) {
        await supabaseAdmin
          .from("ai_ad_queue")
          .update({ status: "done", result_url: resultUrl })
          .eq("provider_job_id", jobId);

        // Get project_id and update project row too
        try {
          const { data: qRow } = await supabaseAdmin
            .from("ai_ad_queue")
            .select("project_id, job_type")
            .eq("provider_job_id", jobId)
            .single();

          if (qRow?.project_id) {
            const col = qRow.job_type === "video" ? "video_url" : "ad_image_url";
            await supabaseAdmin
              .from("ai_ad_projects")
              .update({ [col]: resultUrl, status: "done" })
              .eq("id", qRow.project_id);
          }
        } catch { /* non-fatal */ }

        console.log(`[Queue Poll] ✅ Supabase updated — job done`);
      }

      return NextResponse.json({ jobId, status: "done", resultUrl });
    }

    // Unknown status — treat as still processing
    return NextResponse.json({ jobId, status: "processing" });

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
