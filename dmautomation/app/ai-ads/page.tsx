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

      {/* ── Carousel Section ── */}
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
            <div className="flex items-center gap-4">
              <button className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95">
                <ArrowLeft className="w-6 h-6 text-white/70" />
              </button>
              <button className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95">
                <ArrowRight className="w-6 h-6 text-white/70" />
              </button>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="relative w-full" style={parallax(4)}>
            {/* Fade bounds to blend with the dark background */}
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030308] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#030308] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {[
                { img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=800&fit=crop", text: "Want to take stunning photos, let's..." },
                { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=800&fit=crop" },
                { img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=800&fit=crop" },
                { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=800&fit=crop" },
              ].map((card, i) => (
                <div key={i} className="relative shrink-0 w-[240px] md:w-[280px] h-[420px] md:h-[480px] rounded-[2rem] overflow-hidden snap-center border border-white/10 shadow-2xl shadow-indigo-500/10 group cursor-pointer bg-white/5">
                  <img 
                    src={card.img} 
                    alt="Vertical content preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  {/* Glass gradient over image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {card.text && (
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-lg">
                        <p className="text-white/90 text-sm font-medium leading-snug">{card.text}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Play button overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
                      <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[14px] border-l-white ml-1 drop-shadow-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
      `}</style>
    </div>
  );
}
