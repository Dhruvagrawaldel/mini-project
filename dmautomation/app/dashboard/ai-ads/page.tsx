"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Zap, ImagePlus, X, Rocket, Video } from "lucide-react";

/* ─── Static data ─────────────────────────────────────────────────────────── */

const TRY_SUGGESTIONS = [
  "Company news",
  "Product launch",
  "Brand story",
  "Tutorial video",
  "Promo ad",
  "Customer review",
];

const VIDEO_CARDS = [
  { label: "Ad",             img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", caption: "it's probably" },
  { label: "Tutorial",       img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop",    caption: "teach, entertain" },
  { label: "Promo",          img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop", caption: "find a game",      highlight: true },
  { label: "Story",          img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop", caption: "My life is written" },
  { label: "Product Review", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop", caption: "the best product",  cursive: true },
];

const CAROUSEL_ITEMS = [
  { img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=800&fit=crop", text: "Want to take stunning photos, let's..." },
  { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=800&fit=crop", text: "Create viral content instantly" },
  { img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=800&fit=crop", text: "Brand stories that convert" },
  { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=800&fit=crop", text: "Aesthetic reels on demand" },
  { img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=800&fit=crop", text: "AI-powered ad generation" },
  { img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=800&fit=crop", text: "Scroll-stopping visuals" },
  // duplicated for seamless loop
  { img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=800&fit=crop", text: "Want to take stunning photos, let's..." },
  { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=800&fit=crop", text: "Create viral content instantly" },
  { img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=800&fit=crop", text: "Brand stories that convert" },
  { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=800&fit=crop", text: "Aesthetic reels on demand" },
  { img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=800&fit=crop", text: "AI-powered ad generation" },
  { img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=800&fit=crop", text: "Scroll-stopping visuals" },
];

const HOW_TO = [
  { step: "01", title: "Choose your starting point", desc: "Pick Text to Video, Image to Video, or Video to Video. Describe your concept or upload your assets." },
  { step: "02", title: "Select model & format",       desc: "Choose from Veo 3, Kling, or other AI models. Set your ratio: 9:16 for Reels, 1:1 for Feed, 16:9 for YouTube." },
  { step: "03", title: "Edit and export",             desc: "Refine in our editor — add voiceovers, captions, logos, and brand colors. Export in one click." },
];

const EDITOR_FEATURES = [
  { title: "Edit by text",        desc: "Trim videos by deleting transcript text. As easy as editing a doc.",                                          img: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=600&h=400&fit=crop" },
  { title: "Caption translation", desc: "Translate captions to 100+ languages and reach your audience globally.",                                       img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=400&fit=crop" },
  { title: "Change ratio",        desc: "One click to resize for any platform instantly.",                                                              img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop" },
  { title: "Timeline editing",    desc: "Fine-tune edits down to the second with an intuitive timeline editor.",                                        img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop" },
  { title: "Brand template",      desc: "Use AutoDM templates or save your own. Stay on brand every time.",                                             img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop" },
  { title: "Link share",          desc: "Share videos as a link and collaborate with your team effortlessly.",                                          img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop" },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function DashboardAiAdsPage() {
  const [prompt, setPrompt]     = useState("");
  const [tryIdx, setTryIdx]     = useState(0);
  const [mounted, setMounted]   = useState(false);
  const textareaRef             = useRef<HTMLTextAreaElement>(null);

  // New states for AI Generation
  const [promptType, setPromptType] = useState("master");
  const [imageUrl, setImageUrl]     = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video generation states
  const [pollUrl, setPollUrl] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string>("");
  const [finalVideo, setFinalVideo] = useState<string | null>(null);

  const [videoError, setVideoError] = useState<string | null>(null);
  const pollRetries  = useRef(0);
  const retryTimer   = useRef<NodeJS.Timeout | null>(null);
  const [retryCountdown, setRetryCountdown] = useState(0);

  const PROMPT_TYPES = [
    { id: "master", label: "Universal Ad" },
    { id: "image", label: "Image to Video" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "viral", label: "Viral Shorts" },
    { id: "autodm", label: "Auto-DM Combo" },
    { id: "premium", label: "Cinematic" }
  ];


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
      if (promptType === "master") setPromptType("image");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt && !imageUrl) return;
    setIsGenerating(true);
    setGeneratedScript(null);
    setFinalVideo(null);
    setVideoStatus("");
    setVideoError(null);
    setPollUrl(null);
    pollRetries.current = 0;
    try {
      const res = await fetch("/api/ai-ads/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptType,
          userInput: prompt,
          hasImage: !!imageUrl
        })
      });
      const data = await res.json();
      setGeneratedScript(data);
      startVideoGeneration(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const startVideoGeneration = async (scriptData: any) => {
    setVideoStatus("starting");
    setVideoError(null);
    setRetryCountdown(0);
    if (retryTimer.current) clearInterval(retryTimer.current);
    try {
      const res = await fetch("/api/ai-ads/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrl || undefined,
          headline: scriptData.hook?.substring(0, 80) || "Amazing Video"
        })
      });
      const data = await res.json().catch(() => ({}));

      // 429 Rate Limited — auto-retry after countdown
      if (res.status === 429 && data.status === "rate_limited") {
        const secs = data.retryAfter ?? 15;
        console.warn(`[Video Gen] Rate limited — retrying in ${secs}s`);
        setVideoStatus("rate_limited");
        setRetryCountdown(secs);
        let remaining = secs;
        retryTimer.current = setInterval(() => {
          remaining -= 1;
          setRetryCountdown(remaining);
          if (remaining <= 0) {
            clearInterval(retryTimer.current!);
            retryTimer.current = null;
            startVideoGeneration(scriptData); // auto-retry
          }
        }, 1000);
        return;
      }

      // Other non-2xx errors
      if (!res.ok) {
        const msg = data?.message || `Server error ${res.status}`;
        console.error("[Video Gen] Backend error:", msg);
        setVideoError(msg);
        setVideoStatus("failed");
        return;
      }

      if (data.status === "done" && data.resultUrl) {
         setVideoStatus("done");
         setFinalVideo(data.resultUrl);
         setPollUrl(null);
      } else if (data.pollUrl) {
         setPollUrl(data.pollUrl);
         pollRetries.current = 0;
         setVideoStatus("processing");
      } else if (data.status === "failed") {
         setVideoError(data.message || "Video generation failed.");
         setVideoStatus("failed");
      } else {
         const msg = data?.message || "Unexpected response from server.";
         console.error("[Video Gen] Unknown response:", data);
         setVideoError(msg);
         setVideoStatus("failed");
      }
    } catch (err: any) {
      console.error("Video Gen Error", err);
      setVideoError(err.message || "Network error.");
      setVideoStatus("failed");
    }
  };

  useEffect(() => { setMounted(true); }, []);

  // Poll for video completion — every 3 sec, max 60 polls (3 minutes)
  useEffect(() => {
    if (!pollUrl) return;

    const MAX_RETRIES = 200; // 200 × 3s = 10 minutes hard stop

    const interval = setInterval(async () => {
      // Safety stop — never spam Replicate forever
      if (pollRetries.current >= MAX_RETRIES) {
        console.warn(`[Polling] ❌ Max retries (${MAX_RETRIES}) reached — stopping poll`);
        setVideoStatus("failed");
        setVideoError("Video generation timed out after 10 minutes. Please try again.");
        setPollUrl(null);
        clearInterval(interval);
        return;
      }

      pollRetries.current += 1;

      try {
        const res = await fetch(pollUrl);
        const data = await res.json();

        console.log(`[Polling] Attempt ${pollRetries.current}/${MAX_RETRIES} — status: ${data.status}`);

        // Accept both 'done' and 'succeeded' (Replicate uses 'done' via DB)
        if (data.status === "done" || data.status === "succeeded") {
          console.log("[Polling] ✅ Video ready:", data.resultUrl);
          setVideoStatus("done");
          setFinalVideo(data.resultUrl);
          setPollUrl(null);
          clearInterval(interval);
        } else if (data.status === "failed") {
          console.warn("[Polling] ❌ Job failed");
          setVideoStatus("failed");
          setVideoError(data.message || "Video generation failed on the server.");
          setPollUrl(null);
          clearInterval(interval);
        } else {
          // Still processing — update status label, continue polling
          setVideoStatus("processing");
        }
      } catch (err) {
        console.error("[Polling] Network error:", err);
        // Don't stop on transient errors, just keep retrying
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [pollUrl]);

  // Cycle suggestion every 2.5 s
  useEffect(() => {
    const id = setInterval(() => setTryIdx(i => (i + 1) % TRY_SUGGESTIONS.length), 2500);
    return () => clearInterval(id);
  }, []);

  const prev = () => setTryIdx(i => (i - 1 + TRY_SUGGESTIONS.length) % TRY_SUGGESTIONS.length);
  const next = () => setTryIdx(i => (i + 1) % TRY_SUGGESTIONS.length);
  const applySuggestion = () => {
    setPrompt(TRY_SUGGESTIONS[tryIdx]);
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-stretch overflow-x-hidden" style={{ background: "linear-gradient(160deg,#0c0617 0%,#060612 50%,#0a0a18 100%)" }}>

      {/* ── decorative orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-30" style={{ background: "radial-gradient(ellipse,rgba(139,92,246,0.55) 0%,transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: "radial-gradient(ellipse,rgba(59,130,246,0.4) 0%,transparent 70%)", filter: "blur(100px)" }} />
        <div className="absolute top-1/2 left-0 w-[350px] h-[350px] rounded-full opacity-15" style={{ background: "radial-gradient(ellipse,rgba(236,72,153,0.3) 0%,transparent 70%)", filter: "blur(80px)" }} />
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-14 pb-16">

        {/* Top badge */}
        <div className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm text-xs font-bold text-violet-300 tracking-widest uppercase" style={{ boxShadow: "0 0 20px rgba(139,92,246,0.15)" }}>
          <Zap className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
          Powered by AutoDM AI
        </div>

        {/* ── Split-colour heading ── */}
        <h1 className="font-black leading-none tracking-tight mb-5" style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)" }}>
          <span className="text-white drop-shadow-[0_2px_30px_rgba(255,255,255,0.15)]">AI VIDEO </span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(120deg,#a855f7 0%,#818cf8 50%,#c084fc 100%)", filter: "drop-shadow(0 0 30px rgba(168,85,247,0.5))" }}
          >
            GENERATOR
          </span>
        </h1>

        <p className="text-white/45 text-base md:text-lg max-w-lg leading-relaxed mb-10">
          Generate videos from text, scripts, or images using AI models. Complete with visuals, AI voiceovers, avatars, and subtitles.
        </p>

        {/* ── Input card ── */}
        <div className="w-full max-w-3xl group">
          
          {/* Prompt Type Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6" style={{ perspective: "1000px" }}>
            {PROMPT_TYPES.map(pt => (
              <button
                key={pt.id}
                onClick={() => setPromptType(pt.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${promptType === pt.id ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] scale-105 border-transparent' : 'bg-white/5 text-white/50 hover:text-white/90 hover:bg-white/10 border border-white/10'}`}
              >
                {pt.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-white/60 text-xs font-bold uppercase tracking-wider py-2 pr-2 border-r border-white/20">Video Engine</span>
            <span className="px-4 py-2 rounded-full text-xs font-bold tracking-wider bg-violet-700 text-white shadow-[0_0_20px_rgba(109,40,217,0.5)]">
              ▲ Replicate AI (Wan-2.1 480p)
            </span>
          </div>

          {/* card */}
          <div
            className="relative rounded-[1.4rem] p-[1.5px] transition-all duration-500"
            style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.5),rgba(99,102,241,0.2),rgba(139,92,246,0.5))" }}
          >
            <div className="rounded-[1.35rem] overflow-hidden flex flex-col pt-2" style={{ background: "linear-gradient(160deg,rgba(20,12,40,0.95),rgba(12,8,28,0.98))", backdropFilter: "blur(24px)" }}>
              
              {imageUrl && (
                <div className="px-6 pt-4 pb-2 relative group w-max">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/20">
                    <img src={imageUrl} alt="upload preview" className="w-full h-full object-cover" />
                    <button onClick={() => setImageUrl("")} className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white/80 hover:text-white hover:bg-black/90">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* textarea */}
              <textarea
                ref={textareaRef}
                rows={3}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={promptType === "image" ? "Describe the product image and any specific details to highlight..." : "Describe a topic or paste a script…"}
                className="w-full bg-transparent text-white placeholder:text-white/25 px-6 pt-4 pb-3 outline-none text-[15px] font-medium resize-none leading-relaxed"
              />

              {/* action bar */}
              <div className="flex items-center gap-3 px-5 py-3.5 flex-wrap border-t border-white/10 bg-black/20">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-violet-400 transition-colors"
                  title="Upload image"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Try suggestion */}
                <div className="flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 ml-2">
                  <button onClick={prev} className="p-1 text-white/30 hover:text-violet-400 transition-colors" aria-label="prev">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={applySuggestion} className="px-1.5 text-xs text-white/50 hover:text-white transition-colors whitespace-nowrap">
                    Try: <span className="font-semibold text-white/80">{TRY_SUGGESTIONS[tryIdx]}</span>
                  </button>
                  <button onClick={next} className="p-1 text-white/30 hover:text-violet-400 transition-colors" aria-label="next">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1" />

                {/* CTA */}
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || (!prompt && !imageUrl)}
                  className="group/btn flex items-center gap-2 text-sm font-black text-black px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.04] active:scale-95 disabled:opacity-50 disabled:pointer-events-none" 
                  style={{ background: "linear-gradient(120deg,#b8ff3c,#aaff00)", boxShadow: "0 0 24px rgba(170,255,0,0.4),inset 0 1px 0 rgba(255,255,255,0.3)" }}
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 fill-black/70" />
                  )}
                  {isGenerating ? "Generating..." : "Make with AI"}
                  {!isGenerating && <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Generated Result Overview ── */}
        {generatedScript && (
          <div className="w-full max-w-3xl mt-10 rounded-3xl bg-[#0c0617] border border-violet-500/20 shadow-[0_0_50px_rgba(139,92,246,0.1)] overflow-hidden text-left relative text-white animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-amber-500" />
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-white/95 tracking-tight flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-violet-400" /> AI Script Ready
                  </h3>
                  <p className="text-sm text-white/50 mt-1">Review your generated scenes and script before finalizing.</p>
                </div>
                <button onClick={() => setGeneratedScript(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/60">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {generatedScript.hook && (
                <div className="bg-violet-900/20 p-5 rounded-2xl border border-violet-500/10">
                  <div className="text-xs font-black uppercase text-violet-400 tracking-wider mb-2">🔥 The Hook</div>
                  <p className="text-lg font-medium leading-relaxed italic text-white/90">"{generatedScript.hook}"</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="text-xs font-black uppercase text-white/40 tracking-wider">Scenes Breakdown</div>
                {generatedScript.scenes?.map((scene: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-violet-500/30 transition-all">
                    <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center font-bold text-violet-300 shrink-0 text-sm">
                      {scene.sceneNumber || idx + 1}
                    </div>
                    <div className="space-y-2 text-sm flex-1">
                      <p><span className="text-white/40 font-semibold w-20 inline-block">Visuals:</span> <span className="text-white/90">{scene.visuals}</span></p>
                      {scene.onScreenText && <p><span className="text-white/40 font-semibold w-20 inline-block">Caption:</span> <span className="text-blue-300">"{scene.onScreenText}"</span></p>}
                      {scene.voiceover && <p><span className="text-white/40 font-semibold w-20 inline-block">Voice:</span> <span className="text-emerald-300 italic">"{scene.voiceover}"</span></p>}
                    </div>
                  </div>
                ))}
              </div>

              {generatedScript.dmAutomation && (
                <div className="bg-amber-900/20 p-5 rounded-2xl border border-amber-500/20">
                  <div className="text-xs font-black uppercase text-amber-500 tracking-wider mb-2">🤖 DM Automation Flow</div>
                  <p className="text-sm leading-relaxed text-amber-100/80">{generatedScript.dmAutomation}</p>
                </div>
              )}

              <div className="bg-black/40 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/5">
                <div>
                  <div className="text-xs font-black uppercase text-white/40 mb-1">Visual Style</div>
                  <div className="text-sm font-medium text-white/80">{generatedScript.visualStyle || "Cinematic"}</div>
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-white/40 mb-1">CTA</div>
                  <div className="text-sm font-bold text-pink-400">{generatedScript.cta || "Shop Now"}</div>
                </div>
              </div>

              {/* Video Generation UI */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="w-5 h-5 text-violet-400" />
                  <h4 className="text-lg font-bold text-white/90">AI Video Generation</h4>
                </div>
                
                {videoStatus === "starting" || videoStatus === "processing" ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-black/30 rounded-2xl border border-white/5 border-dashed">
                    <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-400 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium text-white/60 animate-pulse">
                      Generating video with Replicate AI (MiniMax)&hellip; this may take 2&ndash;5 minutes.
                    </p>
                    <p className="text-xs text-white/30 mt-2">Polling every 3 sec &bull; auto-stops when ready</p>
                  </div>
                ) : videoStatus === "rate_limited" ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-amber-950/30 rounded-2xl border border-amber-500/20 text-center">
                    {/* Countdown ring */}
                    <div className="relative w-16 h-16 mb-4">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="4" />
                        <circle
                          cx="32" cy="32" r="28" fill="none"
                          stroke="rgb(245,158,11)" strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (retryCountdown / 20)}`}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 1s linear" }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-amber-400 font-black text-lg">{retryCountdown}</span>
                    </div>
                    <p className="text-sm font-bold text-amber-400">Rate limit — auto-retrying&hellip;</p>
                    <p className="text-xs text-amber-300/60 mt-1">Replicate free tier: 1 request/min &bull; retrying in {retryCountdown}s</p>
                  </div>
                ) : finalVideo ? (

                  <div className="bg-black/40 p-2 rounded-2xl border border-white/10 shadow-xl overflow-hidden max-w-sm mx-auto relative group">
                    <div className="relative rounded-xl overflow-hidden">
                      <video 
                        src={finalVideo} 
                        controls 
                        autoPlay 
                        loop
                        className="w-full h-auto object-contain drop-shadow-2xl" 
                      />
                      {/* CSS Overlay for Headline since FFmpeg drawtext is OS-dependent */}
                      <div className="absolute bottom-14 left-0 right-0 pointer-events-none flex justify-center w-full px-4">
                        <div className="bg-black/60 backdrop-blur-md border-[2px] border-black px-4 py-2" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}>
                           <p className="text-white font-black text-xl md:text-2xl text-center leading-tight tracking-tight uppercase uppercase">
                              {generatedScript?.hook?.substring(0, 30) || "Amazing Video"}
                           </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-center mt-3 mb-1">
                       <a href={finalVideo} download="ad_video.mp4" className="text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-1">
                         <Video className="w-3 h-3" /> Download Source Video
                       </a>
                    </div>
                  </div>
                ) : videoStatus === "failed" ? (
                  <div className="bg-red-500/10 p-5 rounded-xl border border-red-500/30 text-center space-y-3">
                    <p className="text-sm font-bold text-red-400">⚠️ Video Generation Failed</p>
                    {videoError && (
                      <p className="text-xs text-red-300/80 font-mono bg-red-950/40 px-3 py-2 rounded-lg text-left break-all">{videoError}</p>
                    )}
                    {videoError?.includes("REPLICATE_API_TOKEN") && (
                      <a
                        href="https://replicate.com/account/api-tokens"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-full transition-colors"
                      >
                        ▲ Get Replicate API Token →
                      </a>
                    )}
                    <button
                      onClick={() => startVideoGeneration(generatedScript)}
                      className="inline-block text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors ml-2"
                    >
                      🔄 Retry
                    </button>
                  </div>
                ) : null}
              </div>

            </div>
          </div>
        )}

        {/* ── Video type cards ── */}
        <div className="mt-12 flex gap-4 w-full max-w-5xl overflow-x-auto pb-2 scrollbar-hide justify-center">
          {VIDEO_CARDS.map((card, i) => (
            <div
              key={i}
              className="relative shrink-0 w-[155px] md:w-[175px] h-[255px] md:h-[285px] rounded-2xl overflow-hidden cursor-pointer group select-none"
              style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
            >
              <img src={card.img} alt={card.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />

              {/* gradient overlay */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.35) 50%,rgba(0,0,0,0.1) 100%)" }} />

              {/* shine on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),transparent 60%)" }} />

              {/* label pill */}
              <div className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}>
                {card.label}
              </div>

              {/* caption */}
              <p
                className="absolute bottom-4 left-3 right-3 text-xs font-semibold leading-snug"
                style={{
                  color: card.highlight ? "#aaff00" : "rgba(255,255,255,0.85)",
                  fontStyle: card.cursive || card.highlight ? "italic" : "normal",
                  fontFamily: card.cursive ? "Georgia,serif" : undefined,
                  textShadow: card.highlight ? "0 0 12px rgba(170,255,0,0.6)" : "0 1px 6px rgba(0,0,0,0.8)",
                }}
              >
                {card.caption}
              </p>

              {/* hover play */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(139,92,246,0.35)", backdropFilter: "blur(10px)", border: "1.5px solid rgba(139,92,246,0.5)", boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}>
                  <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[13px] border-l-white ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CAROUSEL — Engage your audience
      ═══════════════════════════════════════════════ */}
      <section className="relative z-10 w-full py-20 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-[1fr_2fr] gap-12 items-center">

          <div className="space-y-5">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">What you can create</div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Engage your<br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#a855f7,#ec4899)" }}>audience.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed max-w-xs">
              Scroll-stopping content for TikTok, Instagram, and YouTube — powered by AI.
            </p>
            <div className="flex items-center gap-2.5 text-xs font-bold text-white/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
              </span>
              Auto-playing • Hover to pause
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to right,#060612,transparent)" }} />
            <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to left,#060612,transparent)" }} />
            <div className="flex gap-5 w-max pt-4 pb-8 carousel-track" style={{ animation: "scroll-x 24s linear infinite" }}>
              {CAROUSEL_ITEMS.map((item, i) => (
                <div key={i} className="relative shrink-0 w-[200px] h-[340px] rounded-2xl overflow-hidden group cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
                  <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.1) 60%,transparent)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-3 right-3 bg-black/50 backdrop-blur-md rounded-xl px-3 py-2" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                    <p className="text-white/80 text-[11px] font-semibold line-clamp-2">{item.text}</p>
                  </div>
                  <div className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider text-white/50 px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.08)" }}>Reel</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="relative z-10 w-full py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-violet-400 mb-3">Simple process</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              How to use the{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#a855f7,#6366f1)" }}>
                AI Ad Generator
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-9 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.4),rgba(139,92,246,0.4),transparent)" }} />

            {HOW_TO.map((card, i) => (
              <div key={i} className="relative rounded-2xl p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1" style={{ background: "linear-gradient(160deg,rgba(20,12,40,0.8),rgba(10,6,26,0.9))", border: "1px solid rgba(139,92,246,0.15)", boxShadow: "0 4px 40px rgba(0,0,0,0.4)" }}>
                {/* step circle */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 relative" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.3),rgba(99,102,241,0.2))", border: "1px solid rgba(139,92,246,0.4)", boxShadow: "0 0 16px rgba(139,92,246,0.2)" }}>
                  <span className="text-violet-300">{card.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white/90 leading-snug">{card.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{card.desc}</p>

                {/* bottom accent */}
                <div className="mt-auto pt-4 border-t border-white/[0.06]">
                  <div className="h-1 w-12 rounded-full" style={{ background: "linear-gradient(90deg,#a855f7,#6366f1)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          VIDEO EDITOR FEATURES
      ═══════════════════════════════════════════════ */}
      <section className="relative z-10 w-full py-28 border-t border-white/[0.06]" style={{ background: "linear-gradient(180deg,transparent,rgba(88,28,135,0.12),rgba(67,20,96,0.08),transparent)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-violet-400 mb-3">Built-in tools</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              A full video editor<br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#e879f9,#a855f7,#818cf8)" }}>
                for total creative control
              </span>
            </h2>
            <p className="text-white/35 text-base max-w-sm mx-auto">Edit with AI or manually — your workflow, your rules.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {EDITOR_FEATURES.map((card, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1.5" style={{ background: "linear-gradient(160deg,rgba(88,28,135,0.14),rgba(49,16,72,0.2))", border: "1px solid rgba(139,92,246,0.15)", boxShadow: "0 4px 30px rgba(0,0,0,0.35)" }}>
                {/* image */}
                <div className="relative h-48 overflow-hidden border-b border-violet-500/15">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 opacity-60 group-hover:opacity-0 transition-opacity duration-500" style={{ background: "linear-gradient(to bottom,rgba(88,28,135,0.2),rgba(0,0,0,0.3))" }} />
                </div>
                {/* text */}
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <h3 className="font-bold text-lg text-white/90">{card.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="relative z-10 w-full py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="rounded-3xl py-14 px-10 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(99,102,241,0.15),rgba(236,72,153,0.1))", border: "1px solid rgba(139,92,246,0.25)", boxShadow: "0 0 80px rgba(139,92,246,0.15)" }}>
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(ellipse,rgba(168,85,247,1),transparent 70%)", filter: "blur(40px)" }} />
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Start creating with{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#aaff00,#a3e635)" }}>AI</span>
            </h2>
            <p className="text-white/40 mb-8 text-base max-w-sm mx-auto">Turn any idea into a professional video ad in minutes.</p>
            <button className="inline-flex items-center gap-2.5 text-sm font-black text-black px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95" style={{ background: "linear-gradient(120deg,#b8ff3c,#aaff00)", boxShadow: "0 0 30px rgba(170,255,0,0.45),inset 0 1px 0 rgba(255,255,255,0.3)" }}>
              <Sparkles className="w-4 h-4 fill-black/70" />
              Make your first ad free
            </button>
          </div>
        </div>
      </section>

      <div className="h-10" />

      <style jsx global>{`
        @keyframes scroll-x {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .carousel-track:hover { animation-play-state: paused; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
