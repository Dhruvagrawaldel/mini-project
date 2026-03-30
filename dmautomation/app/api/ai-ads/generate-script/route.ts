import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: "GEMINI_API_KEY is missing in your .env" }, { status: 503 });
    }

    const { projectId, promptType, userInput, audience, platform, tone, hasImage } = await req.json();
    
    if (!userInput && !hasImage) {
      return NextResponse.json({ message: "Input or image is required" }, { status: 400 });
    }

    let systemPrompt = "";

    switch (promptType) {
      case "master":
        systemPrompt = `You are a professional AI video ad creator.
Create a high-converting short video ad based on the following input.

Product/Image Description: ${userInput}
Target Audience: ${audience || "Broad"}
Platform: ${platform || "Instagram"}
Tone: ${tone || "Professional"}
Duration: 10-20 seconds

Generate:
1. Hook (first 3 seconds, scroll-stopping)
2. Scene-by-scene breakdown
3. Visual style (camera movement, lighting, transitions)
4. On-screen text (short, catchy)
5. Voiceover script (natural, engaging)
6. Background music suggestion
7. Call-to-action

Style: Cinematic, High engagement, Fast-paced editing, Social media optimized.`;
        break;
      case "image":
        systemPrompt = `Analyze the uploaded product image (described as: ${userInput}) and create a cinematic video ad.
Focus on:
- Highlighting product features visually
- Adding dynamic motion (zoom, pan, slow motion)
- Creating lifestyle scenes around the product

Ad Style: Premium commercial look, Clean background, Soft lighting + reflections

Scenes:
1. Product reveal (slow zoom-in)
2. Feature highlight (close-up shots)
3. Lifestyle usage (real-world context)
4. Final hero shot

Include: Short captions, Voiceover, Strong CTA. Make it suitable for Instagram Reels.`;
        break;
      case "ecommerce":
        systemPrompt = `Create a high-converting product advertisement video.
Product: ${userInput}

Focus: Problem → Solution → Benefit, Emotional trigger + urgency
Structure:
1. Hook: "Tired of {problem}?"
2. Show product solving it
3. Highlight 3 benefits
4. Social proof style
5. CTA

Tone: Persuasive, energetic
Add: Bold captions, Quick cuts, Trendy background music`;
        break;
      case "viral":
        systemPrompt = `Create a viral short-form video ad.
Input: ${userInput}
Goal: Maximum engagement & shares

Style: Fast cuts (1-2 sec scenes), Trendy transitions, Hook in first 2 seconds
Hook examples: "This changed everything...", "You won't believe this...", "Stop scrolling!"

Include: Big subtitles, Meme-style energy, Loop ending. Make it addictive.`;
        break;
      case "autodm":
        systemPrompt = `Create a video ad AND Instagram auto-reply flow.
Product: ${userInput}

Video:
- Short engaging ad (15 sec)
- Clear CTA: "Comment 'INFO' to get details"

DM Automation:
1. User comments keyword
2. Send DM: Greeting, Product info, Offer, Link

Tone: Friendly + sales-driven`;
        break;
      case "premium":
        systemPrompt = `Create a premium cinematic brand advertisement.
Input: ${userInput}

Focus: Storytelling, Emotional connection, Brand identity
Include: Color grading style, Camera angles, Lighting setup, Script + narration
Make it Apple/Nike-level quality.`;
        break;
      default:
        systemPrompt = `Create a video ad script for: ${userInput}`;
    }

    systemPrompt += `\n\nReturn EXACTLY a valid JSON object with the following structure:
{
  "hook": "The scroll-stopping hook",
  "scenes": [
    { "sceneNumber": 1, "visuals": "...", "onScreenText": "...", "voiceover": "..." }
  ],
  "visualStyle": "...",
  "audioSuggestion": "...",
  "cta": "...",
  "dmAutomation": "..." // (optional, include if applicable)
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(systemPrompt);
    const raw = result.response.text();

    let parsed;
    try {
      const cleanJson = raw.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      return NextResponse.json({ message: "AI returned invalid JSON" }, { status: 502 });
    }

    // Update project if projectId exists
    if (projectId && supabaseAdmin) {
      await supabaseAdmin
        .from("ai_ad_projects")
        .update({
          descriptions: parsed.scenes.map((s: any) => s.visuals), // Use descriptions column for scenes
          cta: parsed.cta,
        })
        .eq("id", projectId);
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("[ai-ads/generate-script]", err);
    return NextResponse.json({ message: err.message ?? "Internal Server Error" }, { status: 500 });
  }
}
