"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Check, X, MessageCircle, Zap, Sparkles, ArrowRight } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

// ── 3D tilt hook (same as landing page cards) ──────────────────────────
function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.transform = `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateZ(20px)`;
    el.style.transition = "transform 0.08s linear";
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    el.style.transition = "transform 0.6s cubic-bezier(0.23,1,0.32,1)";
  };

  return { ref, onMouseMove, onMouseLeave };
}

// ── Plan data ─────────────────────────────────────────────────────────
const plans = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    cta: "Create a Free Account",
    href: "/signup",
    featured: false,
    badge: null,
    accent: "rgba(99,102,241,0.5)",
    borderActive: "rgba(99,102,241,0.6)",
    iconBg: "rgba(99,102,241,0.15)",
    iconColor: "#818cf8",
    features: [
      { text: "Unlimited Automations", ok: true },
      { text: "1,000 DMs / month", ok: true },
      { text: "1,000 Contacts", ok: true },
      { text: "Re-trigger", ok: false },
      { text: "Ask For Follow", ok: false },
      { text: "Lead Gen", ok: false },
    ],
  },
  {
    name: "Pro",
    monthly: 499,
    annual: 399,
    cta: "Get Pro",
    href: "/signup",
    featured: true,
    badge: "✦ UNLIMITED ✦",
    accent: "rgba(139,92,246,0.8)",
    borderActive: "rgba(139,92,246,1)",
    iconBg: "rgba(139,92,246,0.2)",
    iconColor: "#c084fc",
    features: [
      { text: "Unlimited Automations", ok: true },
      { text: "Unlimited DMs", ok: true },
      { text: "Unlimited Contacts", ok: true },
      { text: "Re-trigger", ok: true },
      { text: "Ask For Follow", ok: true },
      { text: "Lead Gen", ok: true },
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    cta: "Get In Touch",
    href: "mailto:contact@autodm.com",
    featured: false,
    badge: null,
    accent: "rgba(236,72,153,0.5)",
    borderActive: "rgba(236,72,153,0.6)",
    iconBg: "rgba(236,72,153,0.15)",
    iconColor: "#f472b6",
    features: [
      { text: "Manage Multiple Accounts", ok: true },
      { text: "Dedicated Account Manager", ok: true },
      { text: "Custom Solutions", ok: true },
      { text: "Early Access New Features", ok: true },
    ],
  },
];

const tableRows = [
  { label: "Pricing",         free: "₹0 /mo",     pro: "₹499 /mo",    type: "text" },
  { label: "Automations",     free: "Unlimited",   pro: "Unlimited",   type: "text", colored: true },
  { label: "DM Send Limit",   free: "1,000",       pro: "Unlimited",   type: "text", proColored: true },
  { label: "Contacts",        free: "1,000",       pro: "Unlimited",   type: "text", proColored: true },
  { label: "Re-trigger",      free: false,         pro: true,          type: "bool" },
  { label: "Ask For Follow",  free: false,         pro: true,          type: "bool" },
  { label: "Lead Gen",        free: false,         pro: true,          type: "bool" },
  { label: "Priority Support",free: false,         pro: true,          type: "bool" },
];

// ── Plan card ────────────────────────────────────────────────────────
function PlanCard({ plan, isAnnual }: { plan: typeof plans[0]; isAnnual: boolean }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(plan.featured ? 8 : 12);
  const price = isAnnual ? plan.annual : plan.monthly;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative"
      style={{ transformStyle: "preserve-3d", paddingTop: plan.badge ? "1.5rem" : "0" }}
    >
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-3xl -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse, ${plan.accent}, transparent 70%)` }}
      />

      {/* Main card */}
      <div
        className="relative rounded-3xl p-8 flex flex-col h-full border"
        style={{
          background: plan.featured
            ? "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.15) 50%, rgba(30,27,75,0.9) 100%)"
            : "rgba(255,255,255,0.03)",
          borderColor: plan.featured ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          boxShadow: plan.featured
            ? "0 0 60px rgba(139,92,246,0.25), 0 0 0 1px rgba(139,92,246,0.3)"
            : "0 0 0 1px rgba(255,255,255,0.03)",
          paddingTop: plan.badge ? "2.5rem" : "2rem",
        }}
      >
        {/* Top shine line */}
        <div
          className="absolute inset-x-0 top-0 h-px rounded-t-3xl"
          style={{
            background: plan.featured
              ? "linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }}
        />

        {/* Badge */}
        {plan.badge && (
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black px-5 py-1.5 rounded-full tracking-widest"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              color: "#000",
              boxShadow: "0 0 20px rgba(245,158,11,0.5)",
              transform: "translateZ(30px)",
            }}
          >
            {plan.badge}
          </div>
        )}

        {/* Plan name */}
        <div style={{ transform: "translateZ(18px)" }}>
          <h2 className="text-2xl font-black text-white mb-1">{plan.name}</h2>

          {/* Price */}
          <div className="my-6">
            {price === null ? (
              <p
                className="text-5xl font-black"
                style={{ background: "linear-gradient(135deg,#fff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                Custom
              </p>
            ) : (
              <>
                <p
                  className="text-6xl font-black leading-none"
                  style={{
                    background: plan.featured
                      ? "linear-gradient(135deg,#fff 40%,#c084fc)"
                      : "linear-gradient(135deg,#fff,#94a3b8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₹{price}
                </p>
                <p className="text-sm text-white/40 mt-1">
                  /account /month{isAnnual && price > 0 ? ", billed annually" : ""}
                </p>
              </>
            )}
          </div>

          {/* CTA button */}
          <Link
            href={plan.href}
            className="block w-full text-center py-3.5 rounded-xl font-bold text-sm mb-8 transition-all hover:scale-[1.03] active:scale-95"
            style={
              plan.featured
                ? {
                    background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
                    color: "#fff",
                    boxShadow: "0 0 30px rgba(139,92,246,0.5)",
                  }
                : {
                    background: "rgba(255,255,255,0.07)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }
            }
          >
            {plan.cta}
          </Link>

          {/* Features */}
          <ul className="space-y-3.5">
            {plan.features.map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                {f.ok ? (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: plan.iconBg, border: `1px solid ${plan.iconColor}40` }}
                  >
                    <Check className="w-3 h-3" style={{ color: plan.iconColor }} />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-red-500/10">
                    <X className="w-3 h-3 text-red-500" />
                  </span>
                )}
                <span className={`text-sm ${f.ok ? "text-white/80" : "text-white/30"}`}>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────
export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

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
    transition: "transform 0.12s linear",
  });

  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-x-hidden" style={{ cursor: "none" }}>
      <CustomCursor />

      {/* ── Ambient BG (identical to landing) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.4) 1px,transparent 1px)`,
            backgroundSize: "80px 80px",
            perspective: "600px",
            transform: "rotateX(20deg) scale(1.5) translateY(-10%)",
            transformOrigin: "50% 0%",
          }}
        />
        <div
          className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-25"
          style={{ background: "radial-gradient(ellipse,rgba(139,92,246,0.6) 0%,transparent 70%)", filter: "blur(80px)", animation: "pulse 6s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[30%] -left-40 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse,rgba(59,130,246,0.8) 0%,transparent 70%)", filter: "blur(60px)", animation: "pulse 8s ease-in-out infinite 2s" }}
        />
        <div
          className="absolute bottom-0 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse,rgba(236,72,153,0.8) 0%,transparent 70%)", filter: "blur(80px)", animation: "pulse 10s ease-in-out infinite 4s" }}
        />
      </div>

      {/* ── Navbar ── */}
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
          <Link href="/pricing" className="text-white font-bold border-b border-primary pb-0.5">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-white/60 hover:text-primary transition-colors">Log in</Link>
          <Link href="/signup" className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-lg shadow-white/10 duration-300">
            Start Free
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* ── Header ── */}
        <div className="text-center mb-16" style={parallax(-10)}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple, transparent pricing
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 leading-none">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg,#fff 30%,#a855f7 70%,#6366f1 100%)",
                filter: "drop-shadow(0 0 40px rgba(168,85,247,0.4))",
              }}
            >
              Pricing
            </span>
          </h1>
          <p className="text-white/40 text-xl">Choose the plan that fits your growth needs.</p>
        </div>

        {/* ── Toggle ── */}
        <div className="flex items-center justify-center gap-5 mb-20" style={parallax(-6)}>
          <span className={`text-sm font-bold transition-colors ${!annual ? "text-white" : "text-white/40"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 rounded-full transition-all duration-500"
            style={{
              background: annual
                ? "linear-gradient(135deg,#8b5cf6,#6366f1)"
                : "rgba(255,255,255,0.1)",
              boxShadow: annual ? "0 0 20px rgba(139,92,246,0.5)" : "none",
            }}
          >
            <div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-500"
              style={{ transform: annual ? "translateX(28px)" : "translateX(0)" }}
            />
          </button>
          <span className={`text-sm font-bold transition-colors ${annual ? "text-white" : "text-white/40"}`}>Annual</span>
          {annual && (
            <span
              className="text-xs font-black px-3 py-1 rounded-full animate-bounce"
              style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", color: "#000" }}
            >
              50% Off
            </span>
          )}
        </div>

        {/* ── Plan Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28 items-center" style={{ transformStyle: "preserve-3d" }}>
          {plans.map((plan, i) => (
            <div key={plan.name} className={`group ${plan.featured ? "md:-mt-6" : ""}`}>
              <PlanCard plan={plan} isAnnual={annual} />
            </div>
          ))}
        </div>

        {/* ── Feature Comparison Table ── */}
        <div className="mb-24">
          <h2
            className="text-3xl md:text-4xl font-black text-center mb-10"
            style={{
              background: "linear-gradient(135deg,#fff 40%,#a855f7 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
            {...({} as any)}
          >
            Feature Comparison
          </h2>

          <div
            className="rounded-3xl overflow-hidden border border-white/7"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(24px)", boxShadow: "0 0 0 1px rgba(255,255,255,0.04)" }}
          >
            {/* Top shine */}
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.5),transparent)" }} />
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-6 font-bold text-lg text-white">Features</th>
                  <th className="p-6 text-center font-semibold text-white/40">Free</th>
                  <th className="p-6 text-center font-bold" style={{ color: "#a78bfa" }}>Pro ✦</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.label} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-5 text-sm font-semibold" style={{ color: "#818cf8" }}>{row.label}</td>
                    <td className="p-5 text-center">
                      {row.type === "text" ? (
                        <span className={`text-sm font-medium ${(row as any).colored ? "text-indigo-400" : "text-white/40"}`}>
                          {String(row.free)}
                        </span>
                      ) : row.free ? (
                        <Check className="w-5 h-5 text-indigo-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-5 text-center">
                      {row.type === "text" ? (
                        <span className={`text-sm font-medium ${(row as any).proColored || (row as any).colored ? "text-violet-400" : "text-white/40"}`}>
                          {String(row.pro)}
                        </span>
                      ) : row.pro ? (
                        <Check className="w-5 h-5 text-violet-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CTA Banner (same style as landing) ── */}
        <div
          className="relative rounded-3xl p-14 text-center overflow-hidden border border-white/10"
          style={{
            background: "linear-gradient(135deg,rgba(139,92,246,0.15) 0%,rgba(99,102,241,0.05) 100%)",
            backdropFilter: "blur(30px)",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px" style={{ background: "linear-gradient(90deg,transparent,#a78bfa,transparent)" }} />
          <div className="absolute -top-20 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse,rgba(139,92,246,0.2),transparent 70%)", filter: "blur(60px)" }} />

          <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ background: "linear-gradient(135deg,#fff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Start automating today
          </h2>
          <p className="text-white/40 mb-10 text-lg max-w-md mx-auto">
            Join thousands of creators saving hours and growing faster on Instagram.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
              boxShadow: "0 0 50px rgba(139,92,246,0.5)",
            }}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 text-center text-white/30">
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
          0%,100% { opacity:0.3; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.05); }
        }
      `}</style>
    </div>
  );
}
