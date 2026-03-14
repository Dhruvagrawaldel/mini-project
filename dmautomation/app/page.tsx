"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Zap, Shield, ArrowRight, BarChart3, ChevronDown } from "lucide-react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";

// ── FAQ Data ──────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is AutoDM free to use?",
    a: "Yes! AutoDM has a free plan that lets you send up to 1,000 DMs per month with unlimited automation rules. No credit card required to get started.",
  },
  {
    q: "Is it safe and won't get my account banned?",
    a: "Absolutely. AutoDM is built on the official Instagram Graph API — the same API Meta provides to businesses. We are a Meta Approved Partner, meaning we go through strict compliance reviews. No third-party workarounds, no risk of shadowbans.",
  },
  {
    q: "How fast does AutoDM respond to comments?",
    a: "Responses are triggered in real-time via Instagram's webhook system. From the moment someone comments your keyword, the DM is typically sent within 1–3 seconds.",
  },
  {
    q: "Can I target a specific post or all posts?",
    a: "Both options are available. You can create rules that apply to a specific post ID, or create global rules that trigger on all posts at once — great for evergreen content.",
  },
  {
    q: "What happens when my Instagram token expires?",
    a: "Long-lived access tokens are valid for 60 days. AutoDM will remind you before expiry, and you can refresh them with a single click from your Settings page to keep automations running.",
  },
  {
    q: "Can I use AutoDM for multiple Instagram accounts?",
    a: "The Enterprise plan supports managing multiple accounts with a dedicated account manager and custom solutions. Contact us to set this up for your team or agency.",
  },
];

// ── FAQ Section Component ─────────────────────────────────────────────
function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative z-10 py-28 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-violet-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            FAQs
          </div>
          <h2
            className="text-4xl md:text-6xl font-black mb-4"
            style={{
              background: "linear-gradient(135deg, #fff 30%, #a855f7 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            All Questions <span style={{ WebkitTextFillColor: "inherit" }}>Answered</span>
          </h2>
          <p className="text-white/40 text-lg">Everything you need to know about AutoDM.</p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden transition-all duration-300"
              style={{
                borderColor: open === i ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.06)",
                background: open === i
                  ? "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 100%)"
                  : "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                boxShadow: open === i ? "0 0 40px rgba(139,92,246,0.1)" : "none",
              }}
            >
              {/* Question row */}
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span
                  className="text-base md:text-lg font-semibold transition-colors duration-200"
                  style={{ color: open === i ? "#c084fc" : "rgba(255,255,255,0.85)" }}
                >
                  {faq.q}
                </span>
                <span
                  className="ml-4 shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: open === i ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.05)",
                    border: open === i ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <ChevronDown
                    className="w-4 h-4 transition-colors duration-200"
                    style={{ color: open === i ? "#a78bfa" : "rgba(255,255,255,0.4)" }}
                  />
                </span>
              </button>

              {/* Answer */}
              <div
                style={{
                  maxHeight: open === i ? "300px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div className="px-6 pb-6">
                  {/* Divider */}
                  <div
                    className="h-px w-full mb-4"
                    style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.3), transparent)" }}
                  />
                  <p className="text-white/55 leading-relaxed text-sm md:text-base">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-white/40 text-sm mb-3">Still have questions?</p>
          <Link
            href="mailto:support@autodm.com"
            className="inline-flex items-center gap-2 text-sm font-bold text-violet-400 hover:text-white transition-colors border border-violet-500/30 hover:border-violet-400 px-5 py-2.5 rounded-full backdrop-blur-sm"
            style={{ background: "rgba(139,92,246,0.08)" }}
          >
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials Data ─────────────────────────────────────────────────
const testimonials = [
  { name: "Dream AI Lab", handle: "@Dreamailab01", avatar: "D", stars: 4, text: "Pichle 1 Month Se Use Kar Rha Hu Aur Ye Mera Growth Ka Game Changer ki Tarah Kam Kiya Hai. Interface Bhi Simple Aur Easy To Setup Mil Jata Hai. Maine 1 month mein 10k+ Followers Gain Kiya Hai — Sirf AutoDM Use Karke." },
  { name: "Manvi", handle: "@manvihiranwal", avatar: "M", stars: 5, text: "This website is genuinely one of the easiest and cleanest platforms I've used. It's super beginner-friendly, smooth to navigate, and everything feels so direct and well-structured. I'd definitely recommend it to anyone looking for a hassle-free automation experience!" },
  { name: "Kushank", handle: "@khushankmathurcuet", avatar: "K", stars: 5, text: "Excellent technical support and smooth automation, far better than most other platforms. Using their tool, I gained 6000+ followers in just 20 days. Deliveries to viewers are always timely. 100% recommended!" },
  { name: "Priya Sharma", handle: "@priyasharma.ig", avatar: "P", stars: 5, text: "Absolutely love AutoDM! It helped me automate my course link delivery and I went from manually replying to 0 missed leads. My revenue doubled in the first month alone. Best investment I've made!" },
];

const testimonialsB = [
  { name: "Rahul Verma", handle: "@rahulv_creator", avatar: "R", stars: 5, text: "AutoDM is a game changer for my coaching business. I post a Reel, drop a keyword in the caption, and leads flood in automatically. Saved me 3+ hours per day of manual DM work." },
  { name: "Sneha K", handle: "@snehak.lives", avatar: "S", stars: 5, text: "Super impressed with how reliable and fast AutoDM is. My comment-to-DM response time is under 2 seconds now. My audience loves the instant replies. Feels like I have a full-time assistant!" },
  { name: "Arjun Mehta", handle: "@arjunmehta_ig", avatar: "A", stars: 4, text: "Setup was incredibly easy. I had my first automation running in less than 5 minutes. The pricing is very fair for what you get. Will definitely upgrade to Pro soon!" },
  { name: "Tanya Patel", handle: "@tanyapatel.official", avatar: "T", stars: 5, text: "This tool is exactly what Instagram creators needed. I use it for product drops, webinar signups, and free guides. The Lead Gen feature alone is worth every rupee. Highly recommend!" },
];

// ── Testimonial Card ──────────────────────────────────────────────────
function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      className="shrink-0 w-80 rounded-2xl p-5 border border-white/7 group hover:border-violet-500/40 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill={i < t.stars ? "#f59e0b" : "rgba(255,255,255,0.15)"}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      {/* Review */}
      <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-4">{t.text}</p>
      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
        >
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{t.name}</p>
          <p className="text-xs text-white/35">{t.handle}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const parallax = (depth: number) => ({
    transform: mounted
      ? `translate(${mousePos.x * depth}px, ${mousePos.y * depth}px)`
      : "translate(0,0)",
    transition: "transform 0.1s linear",
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#030308] text-white overflow-x-hidden" style={{ cursor: "none" }}>
      <CustomCursor />

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* deep grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            perspective: "600px",
            transform: "rotateX(20deg) scale(1.5) translateY(-10%)",
            transformOrigin: "50% 0%",
          }}
        />
        {/* orbs */}
        <div
          className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(139,92,246,0.6) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[40%] -left-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(59,130,246,0.8) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "pulse 8s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute bottom-0 right-[-100px] w-80 h-80 rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse, rgba(236,72,153,0.8) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pulse 10s ease-in-out infinite 4s",
          }}
        />
      </div>

      {/* ── Navigation ── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 backdrop-blur-sm">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tight">AutoDM</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link
            href="/ai-ads"
            className="group flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/50"
            style={{ boxShadow: "0 0 20px rgba(139,92,246,0.15)" }}
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

      {/* ── Hero ── */}
      <main
        ref={heroRef}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-32 max-w-7xl mx-auto text-center"
        style={{ perspective: "1000px" }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 text-sm font-medium text-white/70"
          style={parallax(-8)}
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          Meta Approved Partner API
        </div>

        {/* Headline */}
        <div style={parallax(-12)}>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 max-w-5xl leading-none">
            <span className="text-white">Automate your</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #6366f1 100%)",
                filter: "drop-shadow(0 0 40px rgba(168,85,247,0.5))",
              }}
            >
              Instagram DMs
            </span>
            <br />
            <span className="text-white">on autopilot</span>
          </h1>
        </div>

        {/* Sub */}
        <div style={parallax(-6)}>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-14 leading-relaxed">
            Turn your Instagram comments into sales. Instantly send DMs, links, and resources to anyone who comments a specific keyword on your posts.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4" style={parallax(-4)}>
          <Link
            href="/signup"
            className="group relative flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold overflow-hidden transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #6366f1 100%)",
              boxShadow: "0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(168,85,247,0.2)",
            }}
          >
            <span className="relative z-10">Start Automating Now</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </Link>
          <Link
            href="#demo"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold border border-white/15 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all backdrop-blur-sm"
          >
            Watch Demo
          </Link>
        </div>

        {/* 3D Floating Card (mock UI preview) */}
        <div
          className="mt-24 relative"
          style={{
            ...parallax(20),
            perspective: "1000px",
          }}
        >
          <div
            className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(139,92,246,0.05) 100%)",
              backdropFilter: "blur(20px)",
              transform: mounted
                ? `rotateX(${mousePos.y * -6}deg) rotateY(${mousePos.x * 6}deg)`
                : "rotateX(-5deg)",
              transition: "transform 0.15s linear",
              boxShadow: "0 40px 120px rgba(139,92,246,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Fake dashboard mockup */}
            <div className="bg-[#0d0d1a] p-6 min-w-[340px] md:min-w-[600px]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-auto text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">AutoDM Dashboard</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "DMs Sent", value: "12,840", color: "text-violet-400" },
                  { label: "Active Rules", value: "7", color: "text-blue-400" },
                  { label: "Hours Saved", value: "641", color: "text-pink-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-white/40 text-xs mb-1">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {["🎯 Course Link AutoDM", "🔥 Webinar Registration", "📦 Product Drop Alert"].map((rule, i) => (
                  <div key={rule} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                    <span className="text-sm text-white/70">{rule}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${i === 1 ? "bg-yellow-500/20 text-yellow-400" : "bg-violet-500/20 text-violet-400"}`}>
                      {i === 1 ? "Paused" : "Active"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating glow below card */}
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-3xl opacity-40 rounded-full"
            style={{ background: "linear-gradient(90deg, #8b5cf6, #6366f1)" }}
          />
        </div>
      </main>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #fff 40%, #a855f7)" }}>
                Everything you need to scale
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-lg">Stop leaving money on the table. Respond to every lead instantly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Zap, label: "Instant Responses", desc: "Deliver links, lead magnets, and answers within seconds of a user leaving a comment.", color: "#a855f7" },
              { Icon: BarChart3, label: "Real-time Analytics", desc: "Track comments detected, DMs sent, and conversion rates directly from your dashboard.", color: "#3b82f6" },
              { Icon: Shield, label: "100% Safe & Compliant", desc: "Built on the official Instagram Graph API. No shadowbans or sketchy workarounds.", color: "#10b981" },
            ].map(({ Icon, label, desc, color }) => (
              <div
                key={label}
                className="group relative p-8 rounded-3xl border border-white/5 bg-white/3 backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden"
                data-cursor-hover
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}20 0%, transparent 70%)` }}
                />
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{label}</h3>
                <p className="text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative z-10 py-24 overflow-hidden">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, #030308, transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(-90deg, #030308, transparent)" }} />

        {/* Header */}
        <div className="text-center mb-14 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-violet-400 text-sm font-medium mb-6">
            <span>👀</span>
            Social Proof
          </div>
          <h2
            className="text-4xl md:text-5xl font-black"
            style={{ background: "linear-gradient(135deg,#fff 40%,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            See What People Are Saying
          </h2>
        </div>

        {/* Row 1 — scrolls left */}
        <div className="mb-4">
          <div
            className="flex gap-4"
            style={{ animation: "marquee 35s linear infinite", width: "max-content" }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div>
          <div
            className="flex gap-4"
            style={{ animation: "marqueeRight 40s linear infinite", width: "max-content" }}
          >
            {[...testimonialsB, ...testimonialsB].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-violet-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              3 simple steps
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ background: "linear-gradient(135deg,#fff 40%,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              How it works
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-lg">Set up your first automation in under 3 minutes.</p>
          </div>

          {/* Step 1 — Connect */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            {/* Left: Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)" }}>1</span>
                <span className="text-violet-400 font-semibold text-sm">Connect Your Account</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Link Instagram<br />
                <span style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>in one click</span>
              </h3>
              <p className="text-white/50 text-lg leading-relaxed">
                Securely connect your Instagram Professional account using the official Meta OAuth. No passwords shared — fully safe and compliant.
              </p>
              <ul className="space-y-3">
                {["Meta Verified API", "No password sharing", "Instant setup"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)" }}>
                      <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)", boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}>
                Start For Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: Mockup */}
            <div className="relative flex justify-center">
              <div className="relative w-72 rounded-3xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", boxShadow: "0 0 60px rgba(139,92,246,0.2)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" /><div className="w-3 h-3 rounded-full bg-yellow-500/80" /><div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-black">IG</div>
                    <div>
                      <p className="text-sm font-bold text-white">Instagram Business</p>
                      <p className="text-xs text-white/40">@yourbrand</p>
                    </div>
                    <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.2)" }}>
                      <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-green-400" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                      ✓ Connected Successfully
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "linear-gradient(90deg,#8b5cf6,#6366f1)", width: "100%" }} />
                </div>
              </div>
              {/* Glow */}
              <div className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-30" style={{ background: "radial-gradient(ellipse,rgba(139,92,246,0.8),transparent 70%)" }} />
            </div>
          </div>

          {/* Step 2 — Keywords (reversed) */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            {/* Left: Mockup (reversed on desktop) */}
            <div className="relative flex justify-center md:order-1 order-2">
              <div className="relative w-80 rounded-3xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", boxShadow: "0 0 60px rgba(59,130,246,0.2)" }}>
                <p className="text-xs text-white/40 mb-3 font-medium uppercase tracking-widest">Automation Rule</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Name</p>
                    <div className="bg-white/5 rounded-xl px-3 py-2 text-sm text-white border border-white/10">Course Link DM</div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Trigger Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {["course", "link", "info", "how"].map(k => (
                        <span key={k} className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)", color: "#60a5fa" }}>{k}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Message to send</p>
                    <div className="bg-white/5 rounded-xl px-3 py-2 text-sm text-white/80 border border-white/10 leading-relaxed">
                      Hey! Here's the link to my course 👉 bit.ly/mycourse ✨
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-white/40">Status</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }}>● Active</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-30" style={{ background: "radial-gradient(ellipse,rgba(59,130,246,0.8),transparent 70%)" }} />
            </div>

            {/* Right: Text */}
            <div className="space-y-6 md:order-2 order-1">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}>2</span>
                <span className="text-blue-400 font-semibold text-sm">Set Your Keywords</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Define what<br />
                <span style={{ background: "linear-gradient(135deg,#60a5fa,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>triggers a DM</span>
              </h3>
              <p className="text-white/50 text-lg leading-relaxed">
                Tell AutoDM which words to watch for in your comments. Set up rules for any post — or all posts at once. It takes under 60 seconds.
              </p>
              <ul className="space-y-3">
                {["Works on any post", "Multiple keywords per rule", "Target specific or all posts"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)" }}>
                      <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 3 — AutoDM */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full" style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)" }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: "linear-gradient(135deg,#ec4899,#a855f7)" }}>3</span>
                <span className="text-pink-400 font-semibold text-sm">Watch It Automate</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Instant DMs,<br />
                <span style={{ background: "linear-gradient(135deg,#f472b6,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>zero effort</span>
              </h3>
              <p className="text-white/50 text-lg leading-relaxed">
                The moment someone comments your keyword, AutoDM fires a personalized DM instantly — converting attention into leads on autopilot, 24/7.
              </p>
              <ul className="space-y-3">
                {["Responds in under 2 seconds", "Runs 24 hours a day, 7 days/week", "No manual work required"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(236,72,153,0.2)", border: "1px solid rgba(236,72,153,0.4)" }}>
                      <svg className="w-3 h-3 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#ec4899,#a855f7)", boxShadow: "0 0 30px rgba(236,72,153,0.4)" }}>
                Start Automating <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: Chat Mockup */}
            <div className="relative flex justify-center">
              <div className="relative w-80 rounded-3xl p-5 border border-white/10 space-y-3" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", boxShadow: "0 0 60px rgba(236,72,153,0.2)" }}>
                <p className="text-xs text-white/40 font-medium uppercase tracking-widest mb-1">Direct Message</p>

                {/* Incoming comment notification */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-xs font-black shrink-0">U</div>
                  <div className="rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-white/90 max-w-[85%]" style={{ background: "rgba(255,255,255,0.08)" }}>
                    "course" 🔥
                    <p className="text-xs text-white/30 mt-1">Comment on your post</p>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex items-center gap-2 pl-11">
                  <div className="flex gap-1 px-3 py-2 rounded-full" style={{ background: "rgba(139,92,246,0.2)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-white/30">AutoDM is typing…</span>
                </div>

                {/* AutoDM reply */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-white max-w-[85%]" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.6),rgba(99,102,241,0.6))", border: "1px solid rgba(139,92,246,0.3)" }}>
                    Hey! 👋 Here's the link to my course: bit.ly/mycourse ✨ Let me know if you have questions!
                    <p className="text-xs text-violet-300 mt-1 text-right">Sent instantly ✓✓</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-black shrink-0">A</div>
                </div>

                {/* Heart reaction */}
                <div className="flex items-center gap-2 justify-center py-2">
                  <span className="text-xs text-white/30">User reacted with</span>
                  <span className="text-base animate-bounce">❤️</span>
                  <span className="text-xs font-bold text-pink-400">+9,994 likes</span>
                </div>
              </div>
              <div className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-30" style={{ background: "radial-gradient(ellipse,rgba(236,72,153,0.8),transparent 70%)" }} />
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-24 px-6">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-14 text-center relative overflow-hidden border border-white/10"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.05) 100%)",
            backdropFilter: "blur(30px)",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
          <div className="absolute -top-20 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
            Stop leaving leads waiting.
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10">
            Join modern creators and brands automating their engagement.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 text-lg font-bold px-10 py-5 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              boxShadow: "0 0 50px rgba(139,92,246,0.5)",
            }}
          >
            Start for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {["Meta Verified", "No Credit Card", "Instant Setup"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-sm text-white/50">
                <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 pt-16 pb-0 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-black text-white">AutoDM</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed mb-5">
                Automate your Instagram DMs and grow your business with 24/7 engagement.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { label: "Instagram", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg> },
                  { label: "YouTube", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 4.81 4.81 0 00-4.82 0 4.83 4.83 0 01-3.77 2.75A4.78 4.78 0 005 11.5v1a4.79 4.79 0 002.13 3.99L12 20l4.87-3.51A4.79 4.79 0 0019 12.5v-1a4.78 4.78 0 00-1.41-4.81zM10 15.5l-1.5-.87V11l1.5.87v3.63zm5 0l-1.5.87v-3.63L15 11v4.5z" /></svg> },
                ].map(({ label, icon }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    aria-label={label}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Company links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                {["Pricing", "Features", "About Us", "Contact Us", "Blog"].map(link => (
                  <li key={link}>
                    <Link href={link === "Pricing" ? "/pricing" : "#"} className="text-sm text-white/40 hover:text-white transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Use Cases</h4>
              <ul className="space-y-3">
                {["Lead Generation", "Course Creators", "Coaches & Experts", "Artists & Labels", "Agencies"].map(link => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms & Conditions", "Refund Policy", "Cookie Policy"].map(link => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold text-green-400">Meta Approved Partner</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full mb-6" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)" }} />

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-8 text-sm text-white/30">
            <span>© 2026 AutoDM. All rights reserved.</span>
            <span>Built with ❤️ for Instagram creators worldwide</span>
          </div>
        </div>

        {/* ── Giant watermark ── */}
        <div
          className="relative w-full overflow-hidden select-none pointer-events-none"
          style={{ height: "120px" }}
        >
          <p
            className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-black tracking-tighter leading-none"
            style={{
              fontSize: "clamp(80px, 14vw, 180px)",
              background: "linear-gradient(180deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.02) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AutoDM
          </p>
        </div>
      </footer>


      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
