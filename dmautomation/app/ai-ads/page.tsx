"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Sparkles, Wand2, Megaphone, MonitorPlay, Video, ArrowLeft, ArrowRight } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

export default function AiAdsPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const parallax = (d: number) => ({
    transform: mounted ? `translate(${mousePos.x * d}px, ${mousePos.y * d}px)` : "none",
    transition: "transform 0.1s linear",
  });

  return (
    <div className="min-h-screen bg-[#030308] text-white flex flex-col items-center overflow-x-hidden" style={{ cursor: "none" }}>
      <CustomCursor />

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Deep grid */}
        <div
          className="absolute inset-0 opacity-20 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            perspective: "600px",
            transform: "rotateX(30deg) scale(1.5) translateY(-20%)",
            transformOrigin: "50% 0%",
          }}
        />
        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(139,92,246,0.4) 0%, transparent 70%)",
            filter: "blur(100px)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(59,130,246,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pulse 8s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* ── Navigation ── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 backdrop-blur-sm">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tight">AutoDM</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
          <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link
            href="/ai-ads"
            className="group flex items-center gap-2 text-white px-3 py-1.5 rounded-full border border-violet-500/50 bg-violet-500/10"
            style={{ boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}
          >
            AI Ads
            <div className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400"></span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-white/60 hover:text-primary transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-lg shadow-white/10 duration-300"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-5xl px-6 py-20 mt-10" style={{ perspective: "1000px" }}>
        
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-md mb-8 text-sm font-bold text-violet-300 transition-transform hover:scale-105"
          style={{ ...parallax(-15), boxShadow: "0 0 30px rgba(139,92,246,0.2)" }}
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          AI Text to Video
        </div>

        {/* Headline */}
        <h1 
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-center leading-none"
          style={parallax(-8)}
        >
          <span 
            className="bg-clip-text text-transparent" 
            style={{ 
              backgroundImage: "linear-gradient(135deg, #fff 20%, #a855f7 80%, #6366f1 100%)",
              filter: "drop-shadow(0 4px 40px rgba(168,85,247,0.3))"
            }}
          >
            AI AD GENERATOR
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className="text-lg md:text-xl text-white/50 text-center max-w-2xl mb-16 leading-relaxed"
          style={parallax(-4)}
        >
          Generate professional AI ads in minutes. Create video ads from text, product images, or footage, all in one ad maker.
        </p>

        {/* ── AI Input Bar ── */}
        <div 
          className="w-full max-w-3xl relative mb-12 group transition-all duration-300"
          style={parallax(5)}
        >
          {/* Glowing aura surrounding the input */}
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-violet-500 via-pink-500 to-blue-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
          
          <div className="relative flex items-center bg-[#0d0d1a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-3 shadow-2xl transition-all group-hover:border-violet-500/40">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type in your idea or paste your script here..."
              className="flex-1 bg-transparent text-white placeholder:text-white/30 px-6 py-4 outline-none text-lg font-medium"
            />
            <button 
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              <Sparkles className="w-6 h-6 text-white" fill="white" />
            </button>
          </div>
        </div>

        {/* ── Suggestion Chips ── */}
        <div 
          className="flex flex-wrap items-center justify-center gap-4"
          style={parallax(10)}
        >
          {[
            { icon: Video, label: "Create an ad", color: "text-blue-400", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
            { icon: Megaphone, label: "Create a promo video", color: "text-emerald-400", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
            { icon: MonitorPlay, label: "Create a tutorial", color: "text-amber-400", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
            { icon: Wand2, label: "Create an AI Clip", color: "text-pink-400", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.2)" },
          ].map((chip) => (
            <button
              key={chip.label}
              className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
              onClick={() => setPrompt(chip.label)}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: chip.bg, border: `1px solid ${chip.border}` }}
              >
                <chip.icon className={`w-4 h-4 ${chip.color}`} />
              </div>
              <span className="text-sm font-bold text-white/80">{chip.label}</span>
            </button>
          ))}
        </div>

      </main>

      {/* ── Auto-Running Carousel Section ── */}
      <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-20 mt-10">
        <div className="grid md:grid-cols-[1.2fr_2fr] gap-12 items-center">

          {/* Left Text */}
          <div className="pr-4 md:pr-12" style={parallax(-4)}>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Engage your <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">audience.</span>
            </h2>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-10 max-w-sm">
              Effortlessly produce scroll-stopping content for TikTok, Instagram, and YouTube.
            </p>
            {/* Live indicator */}
            <div className="flex items-center gap-3 text-sm font-bold text-white/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-400" />
              </span>
              Auto-playing • Hover to pause
            </div>
          </div>

          {/* Right: Infinite Auto-Scroll Ticker */}
          <div className="relative w-full overflow-hidden" style={parallax(4)}>
            {/* Left & right fade masks */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#030308] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#030308] to-transparent z-10 pointer-events-none" />

            {/* Ticker track — duplicated for seamless loop */}
            <div className="flex gap-6 pt-4 pb-8 w-max carousel-track" style={{ animation: "scroll-x 22s linear infinite" }}>
              {[
                { img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=800&fit=crop", text: "Want to take stunning photos, let's..." },
                { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=800&fit=crop", text: "Create viral content instantly" },
                { img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=800&fit=crop", text: "Brand stories that convert" },
                { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=800&fit=crop", text: "Aesthetic reels on demand" },
                { img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=800&fit=crop", text: "AI-powered ad generation" },
                { img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=800&fit=crop", text: "Scroll-stopping visuals" },
                // Duplicate for seamless loop
                { img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=800&fit=crop", text: "Want to take stunning photos, let's..." },
                { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=800&fit=crop", text: "Create viral content instantly" },
                { img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=800&fit=crop", text: "Brand stories that convert" },
                { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=800&fit=crop", text: "Aesthetic reels on demand" },
                { img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=800&fit=crop", text: "AI-powered ad generation" },
                { img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=800&fit=crop", text: "Scroll-stopping visuals" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="relative shrink-0 w-[220px] md:w-[260px] h-[380px] md:h-[440px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10 group cursor-pointer bg-white/5"
                >
                  <img
                    src={card.img}
                    alt="Vertical content preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Caption pill */}
                  <div className="absolute bottom-5 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 shadow-lg">
                      <p className="text-white/90 text-xs font-semibold leading-snug line-clamp-2">{card.text}</p>
                    </div>
                  </div>

                  {/* Always-visible play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-xl group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300">
                      <div className="w-0 h-0 border-y-[9px] border-y-transparent border-l-[13px] border-l-white ml-1 drop-shadow-md" />
                    </div>
                  </div>

                  {/* IG Reel badge */}
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[10px] font-black text-white/60 uppercase tracking-wider">
                    Reel
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── How to use section ── */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16" style={parallax(-2)}>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight" style={{ fontFamily: "Impact, sans-serif", letterSpacing: "0.5px" }}>
            How to use the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">AI Ad Generator:</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6" style={parallax(3)}>
          {[
            {
              step: "STEP 1",
              title: "Choose your starting point",
              desc: "Choose Text to Video, Text to Image, Image to Video, or Video to Video. Describe your concept, upload product images, or transform existing footage—our AI advertising tool works with any input type."
            },
            {
              step: "STEP 2",
              title: "Select AI model and video format",
              desc: "Select from models like Veo 3 for cinematic quality, Kling for precise motion, or other specialized models depending on your ad style. Set your aspect ratio (9:16 for TikTok and Reels, 1:1 for Instagram Feed, 16:9 for YouTube). Type your prompt or upload your assets, then generate your video ad."
            },
            {
              step: "STEP 3",
              title: "Edit and export your ad",
              desc: <>Load your AI-generated ad in our video editor. Add your logo and font colors, insert <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">text-to-speech voiceovers</a>, or layer in brand graphics. Combine clips, add captions, and export.</>
            }
          ].map((card, i) => (
            <div 
              key={i} 
              className="bg-[#0b0b13] border border-white/10 rounded-3xl p-8 hover:border-violet-500/30 transition-colors duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-start"
            >
              <div className="text-[10px] font-black tracking-widest text-white/40 mb-4 uppercase">
                {card.step}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white/90 leading-tight">
                {card.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mt-auto">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── More Than An AI Ad Generator ── */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-32 mb-10 overflow-hidden">
        <div className="text-center mb-16" style={parallax(-2)}>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight" style={{ fontFamily: "Impact, sans-serif", letterSpacing: "1px" }}>
            MORE THAN AN <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">AI AD GENERATOR</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 text-white/70 text-lg leading-relaxed mb-24 max-w-5xl mx-auto" style={parallax(2)}>
          <p>
            AutoDM combines AI ad creation with a complete video production platform. Use our <a href="#" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">video script generator</a> to plan campaigns, record screen captures for product demos, and turn presentations into videos. Access professional
          </p>
          <p>
            editing tools, team collaboration features, and brand management—all in one workspace. Whether you're creating video ads, social content, or tutorials, AutoDM supports your entire video workflow. Start creating videos like a pro today!
          </p>
        </div>
      </section>

      {/* ── Video Editor Features ── */}
      <section className="relative z-10 w-full px-6 py-28 bg-gradient-to-b from-transparent via-violet-900/10 to-[#5b21b6]/20 border-t border-white/5 shadow-[inset_0_0_100px_rgba(139,92,246,0.1)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" style={parallax(-2)}>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              Plus, an easy-to-use video<br />editor for full creative control
            </h2>
            <p className="text-xl text-violet-200/80 font-medium">
              Edit with AI or manually, all up to you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6" style={parallax(3)}>
            {[
              {
                title: "Edit by text",
                desc: "Trim videos by deleting the corresponding video transcription. Edit videos as easy as a doc.",
                img: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=600&h=400&fit=crop"
              },
              {
                title: "Caption translation",
                desc: "Translate your captions to over 100 languages and reach your audience globally.",
                img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=400&fit=crop"
              },
              {
                title: "Change ratio",
                desc: "One click to resize and make your videos fit different social platform instantly.",
                img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop"
              },
              {
                title: "Timeline editing",
                desc: "Fine-tune text-based edits by timeline down to seconds-level with our intuitive timeline-editor.",
                img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop"
              },
              {
                title: "Brand template",
                desc: "Leverage templated designed by AutoDM or save one of your own. Make your videos always stay on brand.",
                img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop"
              },
              {
                title: "Link share",
                desc: "Share your videos as a link and collaborate with teams effortlessly.",
                img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
              }
            ].map((card, i) => (
              <div 
                key={i} 
                className="bg-violet-900/20 border border-violet-500/20 rounded-[2rem] overflow-hidden hover:border-violet-400/50 hover:bg-violet-800/20 transition-all duration-300 flex flex-col group cursor-pointer shadow-xl shadow-violet-900/5"
              >
                <div className="h-[220px] overflow-hidden bg-[#0d0d1a] relative border-b border-violet-500/20 p-4">
                  <div className="absolute inset-0 bg-violet-500/5 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none" />
                  <img 
                    src={card.img} 
                    alt={card.title} 
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white/95 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-violet-100/60 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ── Spacer for visual balance ── */}
      <div className="h-20" />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 w-full text-center text-white/30 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="font-black text-white">AutoDM</span>
            <span className="text-sm">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes scroll-x {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .carousel-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
