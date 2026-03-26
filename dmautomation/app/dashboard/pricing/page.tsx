"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Check, X, Zap, Sparkles, ArrowRight, Crown, Building2, Gift } from "lucide-react";
import { motion } from "framer-motion";

// ── 3D Tilt hook ───────────────────────────────────────────────────────
function useTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.transform = `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateZ(10px)`;
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

// ── Plan data (from public pricing page) ───────────────────────────────
const plans = [
  {
    name: "Free",
    icon: Gift,
    monthly: 0,
    annual: 0,
    cta: "Current Plan",
    href: "/dashboard",
    featured: false,
    badge: null,
    accent: "rgba(99,102,241,0.5)",
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
    icon: Crown,
    monthly: 499,
    annual: 399,
    cta: "Upgrade to Pro",
    href: "/signup",
    featured: true,
    badge: "✦ UNLIMITED ✦",
    accent: "rgba(139,92,246,0.8)",
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
    icon: Building2,
    monthly: null,
    annual: null,
    cta: "Get In Touch",
    href: "mailto:contact@autodm.com",
    featured: false,
    badge: null,
    accent: "rgba(236,72,153,0.5)",
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
  { isHeader: true, label: "Core Features" },
  { label: "Pricing",           free: "₹0 /mo",     pro: "₹499 /mo",    ent: "Custom",       type: "text" },
  { label: "Automations",       free: "Unlimited",   pro: "Unlimited",   ent: "Unlimited",    type: "text", colored: true },
  { label: "DM Send Limit",     free: "1,000",       pro: "Unlimited",   ent: "Unlimited",    type: "text", proColored: true },
  { label: "Contacts",          free: "1,000",       pro: "Unlimited",   ent: "Unlimited",    type: "text", proColored: true },
  { label: "Re-trigger",        free: false,         pro: true,          ent: true,           type: "bool" },
  { label: "Ask For Follow",    free: false,         pro: true,          ent: true,           type: "bool" },
  { label: "Lead Gen",          free: false,         pro: true,          ent: true,           type: "bool" },
  { label: "Priority Support",  free: false,         pro: true,          ent: true,           type: "bool" },
  { isHeader: true, label: "Video Creation" },
  { label: "Watermark removal", free: false,         pro: true,          ent: true,           type: "bool" },
  { label: "Monthly credits",   free: "60",          pro: "From 600",    ent: "From 600",     type: "text" },
  { label: "Upload length",     free: "60 mins",     pro: "600 mins",    ent: "600 mins",     type: "text" },
  { label: "Upload size",       free: "1GB",         pro: "10GB",        ent: "10GB",         type: "text" },
  { label: "Upload quality",    free: "1080p",       pro: "4K",          ent: "4K",           type: "text" },
  { label: "Export quality",    free: "720p",        pro: "4K",          ent: "4K",           type: "text" },
  { label: "Export length",     free: "10 mins",     pro: "Unlimited",   ent: "Unlimited",    type: "text" },
  { label: "Storage",           free: "3 days",      pro: "Active sub.", ent: "Active sub.",  type: "text" },
  { label: "API",               free: false,         pro: true,          ent: true,           type: "bool" },
  { label: "API rate limit",    free: "1/m · 10/h",  pro: "3/m · 20/h",  ent: "10/m · 60/h", type: "text" },
];

// ── Plan Card component ────────────────────────────────────────────────
function PlanCard({ plan, isAnnual, idx }: { plan: typeof plans[0]; isAnnual: boolean; idx: number }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(plan.featured ? 6 : 10);
  const price = isAnnual ? plan.annual : plan.monthly;
  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="group"
      style={{ paddingTop: plan.badge ? "1.5rem" : "0" }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glow aura */}
        <div
          className="absolute -inset-px rounded-3xl -z-10 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"
          style={{ background: `radial-gradient(ellipse, ${plan.accent}, transparent 70%)` }}
        />

        {/* Card */}
        <div
          className="relative rounded-3xl p-7 flex flex-col h-full border overflow-hidden"
          style={{
            background: plan.featured
              ? "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(99,102,241,0.12) 50%, rgba(15,12,50,0.95) 100%)"
              : "rgba(255,255,255,0.03)",
            borderColor: plan.featured ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            boxShadow: plan.featured
              ? "0 0 60px rgba(139,92,246,0.2), 0 0 0 1px rgba(139,92,246,0.25)"
              : "none",
            paddingTop: plan.badge ? "2.5rem" : "1.75rem",
          }}
        >
          {/* Top shine line */}
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-3xl"
            style={{
              background: plan.featured
                ? "linear-gradient(90deg, transparent, rgba(167,139,250,0.9), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            }}
          />

          {/* Badge */}
          {plan.badge && (
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black px-5 py-1.5 rounded-full tracking-widest whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
                color: "#000",
                boxShadow: "0 0 20px rgba(245,158,11,0.5)",
              }}
            >
              {plan.badge}
            </div>
          )}

          {/* Icon + name */}
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-2xl" style={{ background: plan.iconBg, border: `1px solid ${plan.iconColor}30` }}>
              <Icon className="w-5 h-5" style={{ color: plan.iconColor }} />
            </div>
            <h2 className="text-xl font-black text-white">{plan.name}</h2>
          </div>

          {/* Price */}
          <div className="mb-6">
            {price === null ? (
              <p className="text-4xl font-black bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg,#fff,#f472b6)" }}>
                Custom
              </p>
            ) : (
              <>
                <p className="text-5xl font-black leading-none"
                  style={{
                    background: plan.featured
                      ? "linear-gradient(135deg,#fff 40%,#c084fc)"
                      : "linear-gradient(135deg,#fff,#94a3b8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                  ₹{price}
                </p>
                <p className="text-xs text-white/40 mt-1.5">
                  /account /month{isAnnual && price > 0 ? ", billed annually" : ""}
                </p>
              </>
            )}
          </div>

          {/* CTA */}
          <Link
            href={plan.href}
            className="block w-full text-center py-3 rounded-2xl font-bold text-sm mb-7 transition-all hover:scale-[1.03] active:scale-95"
            style={
              plan.featured
                ? {
                    background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
                    color: "#fff",
                    boxShadow: "0 0 30px rgba(139,92,246,0.45)",
                  }
                : plan.name === "Free"
                ? {
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "default",
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

          {/* Features list */}
          <ul className="space-y-3 flex-1">
            {plan.features.map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                {f.ok ? (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: plan.iconBg, border: `1px solid ${plan.iconColor}40` }}>
                    <Check className="w-3 h-3" style={{ color: plan.iconColor }} />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-red-500/10 border border-red-500/20">
                    <X className="w-3 h-3 text-red-500/60" />
                  </span>
                )}
                <span className={`text-sm ${f.ok ? "text-white/80" : "text-white/30"}`}>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function DashboardPricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto text-white">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-700/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-700/10 rounded-full blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-black uppercase tracking-widest mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg,#fff 30%,#a855f7 70%,#6366f1 100%)" }}>
          Choose Your Plan
        </h1>
        <p className="text-white/40 text-base">Upgrade anytime. No hidden fees.</p>
      </motion.div>

      {/* ── Toggle ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm font-bold transition-colors ${!annual ? "text-white" : "text-white/40"}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className="relative w-12 h-6 rounded-full transition-all duration-500"
          style={{
            background: annual ? "linear-gradient(135deg,#8b5cf6,#6366f1)" : "rgba(255,255,255,0.1)",
            boxShadow: annual ? "0 0 16px rgba(139,92,246,0.5)" : "none",
          }}
        >
          <div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-500"
            style={{ transform: annual ? "translateX(24px)" : "translateX(0)" }}
          />
        </button>
        <span className={`text-sm font-bold transition-colors ${annual ? "text-white" : "text-white/40"}`}>Annual</span>
        {annual && (
          <span className="text-[11px] font-black px-3 py-1 rounded-full animate-bounce"
            style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", color: "#000" }}>
            Save 20%
          </span>
        )}
      </motion.div>

      {/* ── Plan Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-center" style={{ transformStyle: "preserve-3d" }}>
        {plans.map((plan, i) => (
          <div key={plan.name} className={plan.featured ? "md:-mt-4" : ""}>
            <PlanCard plan={plan} isAnnual={annual} idx={i} />
          </div>
        ))}
      </div>

      {/* ── Feature Comparison Table ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-14">
        <h2 className="text-2xl font-black text-center mb-8 bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg,#fff 40%,#a855f7 100%)" }}>
          Full Feature Comparison
        </h2>

        <div className="rounded-3xl overflow-hidden border border-white/8"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(24px)" }}>
          {/* Top shine */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.5),transparent)" }} />

          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left p-5 font-bold text-base text-white/70 pl-6">Features</th>
                <th className="p-5 text-center font-bold text-white/40 text-sm">Free</th>
                <th className="p-5 text-center font-bold text-sm" style={{ color: "#a78bfa" }}>Pro ✦</th>
                <th className="p-5 text-center font-bold text-sm" style={{ color: "#f472b6" }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) =>
                (row as any).isHeader ? (
                  <tr key={row.label + i} className="border-b border-white/5 bg-white/[0.025]">
                    <td colSpan={4} className="px-6 py-3.5 text-sm font-black tracking-widest text-white/60 uppercase">
                      {row.label}
                    </td>
                  </tr>
                ) : (
                  <tr key={row.label + i} className="border-b border-white/5 hover:bg-white/[0.025] transition-colors">
                    <td className="p-4 text-sm font-semibold pl-6" style={{ color: "#818cf8" }}>{row.label}</td>
                    <td className="p-4 text-center">
                      {row.type === "text" ? (
                        <span className={`text-sm font-medium ${(row as any).colored ? "text-indigo-400" : "text-white/40"}`}>{row.free as string}</span>
                      ) : row.free ? (
                        <Check className="w-4 h-4 text-indigo-400 mx-auto" strokeWidth={3} />
                      ) : (
                        <span className="text-white/15 font-bold">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.type === "text" ? (
                        <span className={`text-sm font-medium ${(row as any).proColored || (row as any).colored ? "text-violet-400" : "text-white/40"}`}>{row.pro as string}</span>
                      ) : row.pro ? (
                        <Check className="w-4 h-4 text-violet-400 mx-auto" strokeWidth={3} />
                      ) : (
                        <span className="text-white/15 font-bold">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.type === "text" ? (
                        <span className={`text-sm font-medium ${(row as any).entColored || (row as any).colored ? "text-pink-400" : "text-white/40"}`}>{(row as any).ent as string}</span>
                      ) : (row as any).ent ? (
                        <Check className="w-4 h-4 text-pink-400 mx-auto" strokeWidth={3} />
                      ) : (
                        <span className="text-white/15 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── CTA Banner ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="relative rounded-3xl p-10 text-center overflow-hidden border border-white/10"
        style={{
          background: "linear-gradient(135deg,rgba(139,92,246,0.15) 0%,rgba(99,102,241,0.05) 100%)",
          backdropFilter: "blur(30px)",
        }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
          style={{ background: "linear-gradient(90deg,transparent,#a78bfa,transparent)" }} />
        <div className="absolute -top-16 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(139,92,246,0.2),transparent 70%)", filter: "blur(60px)" }} />

        <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
        <h2 className="text-3xl font-black mb-3 bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg,#fff,#a78bfa)" }}>
          Ready to go unlimited?
        </h2>
        <p className="text-white/40 mb-8 max-w-md mx-auto">
          Upgrade to Pro and remove all limits. Join thousands of creators automating their Instagram growth.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-3 font-bold px-9 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)", boxShadow: "0 0 40px rgba(139,92,246,0.5)" }}
        >
          Upgrade to Pro
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
          {["Meta Verified", "No Hidden Fees", "Cancel Anytime"].map((badge) => (
            <span key={badge} className="flex items-center gap-1.5 text-xs text-white/40">
              <Check className="w-3 h-3 text-violet-400" strokeWidth={3} />
              {badge}
            </span>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
