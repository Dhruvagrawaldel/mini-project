import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Only confirmed-valid model IDs for the @google/generative-ai SDK v1beta API
const MODEL_FALLBACK = [
  "gemini-1.5-flash",
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function callGeminiWithRetry(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: "GEMINI_API_KEY is missing in your .env" }, { status: 503 });
    }

    const { projectId, productDescription, tone, platform, audience } = await req.json();
    if (!productDescription)
      return NextResponse.json({ message: "productDescription is required" }, { status: 400 });

    const platformStr = Array.isArray(platform) ? platform.join(", ") : (platform ?? "Instagram");
    const audienceStr = audience
      ? `Age: ${audience.age || "18-35"}, Interests: ${audience.interest || "general"}, Location: ${audience.location || "global"}`
      : "broad audience";

    const prompt = `You are an expert digital advertising copywriter specializing in high-converting social media ads.
Create compelling ad copy for the following:

Product/Service: ${productDescription}
Ad Platform(s): ${platformStr}
Tone: ${tone || "professional"}
Target Audience: ${audienceStr}

Return ONLY a valid JSON object with this exact structure:
{
  "headlines": ["headline1", "headline2", "headline3", "headline4", "headline5"],
  "descriptions": ["description1 (2-3 sentences)", "description2 (2-3 sentences)", "description3 (2-3 sentences)"],
  "cta": "Call to action text",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"]
}

Guidelines:
- Headlines: punchy, benefit-driven, max 60 chars each
- Descriptions: platform-optimised, include a hook and benefit
- CTA: action-oriented (e.g. "Shop Now →", "Get 50% OFF →", "Try Free Today →")
- Hashtags: mix of niche and broad tags relevant to the product`;

    const raw = await callGeminiWithRetry(prompt);

    let parsed: { headlines: string[]; descriptions: string[]; cta: string; hashtags: string[] };
    try {
      const cleanJson = raw.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      return NextResponse.json({ message: "AI returned invalid JSON" }, { status: 502 });
    }

    if (projectId && supabaseAdmin) {
      await supabaseAdmin
        .from("ai_ad_projects")
        .update({
          headlines:    parsed.headlines,
          descriptions: parsed.descriptions,
          cta:          parsed.cta,
          hashtags:     parsed.hashtags,
          status:       "generating",
        })
        .eq("id", projectId);
    }

    return NextResponse.json({ ...parsed, projectId });
  } catch (err: any) {
    console.error("[ai-ads/generate-copy]", err);
    const isQuota = err?.message?.toLowerCase().includes("quota") || err?.message?.includes("429");
    return NextResponse.json(
      { message: isQuota ? "Gemini quota exhausted" : (err.message ?? "Internal Server Error") },
      { status: isQuota ? 429 : 500 }
    );
  }
}
