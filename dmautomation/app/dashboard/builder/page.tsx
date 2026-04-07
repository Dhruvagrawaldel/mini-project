"use client";

import {
  MessageSquareText,
  Zap,
  Link as LinkIcon,
  Instagram,
  ChevronRight,
  Save,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  BrainCircuit,
  Target,
  MessageCircle,
  ArrowRight,
  Cpu,
  Radio,
  Shield,
  Rocket,
  Check,
  Film,
  RefreshCw,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── Animated Node Connector ─────────────────────────────────────────────────
function NodeConnector({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center my-1 relative">
      <div className={`w-px h-8 relative overflow-hidden rounded-full transition-colors duration-500 ${active ? "bg-violet-500/40" : "bg-white/10"}`}>
        {active && (
          <motion.div
            className="absolute top-0 w-full bg-gradient-to-b from-transparent via-violet-400 to-transparent"
            style={{ height: "40%" }}
            animate={{ y: ["0%", "300%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Step Node Badge ──────────────────────────────────────────────────────────
function StepBadge({ num, active, done }: { num: number; active: boolean; done: boolean }) {
  return (
    <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all duration-500 shrink-0
      ${done ? "border-violet-400 bg-violet-500/20 text-violet-300" :
        active ? "border-violet-500 bg-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.6)]" :
        "border-white/10 bg-white/5 text-white/30"}`}>
      {num}
      {active && (
        <motion.div
          className="absolute inset-0 rounded-full border border-violet-400"
          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
    </div>
  );
}

// ─── Glowing Terminal Card ────────────────────────────────────────────────────
function FlowCard({ children, glowColor = "violet", step, title, icon, active }: {
  children: React.ReactNode;
  glowColor?: "violet" | "cyan" | "orange" | "emerald";
  step: number;
  title: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  const colors = {
    violet: { border: "border-violet-500/30", glow: "shadow-[0_0_40px_rgba(139,92,246,0.12)]", icon: "bg-violet-500/15 text-violet-400", ring: "ring-violet-500/20" },
    cyan: { border: "border-cyan-500/30", glow: "shadow-[0_0_40px_rgba(6,182,212,0.12)]", icon: "bg-cyan-500/15 text-cyan-400", ring: "ring-cyan-500/20" },
    orange: { border: "border-orange-500/30", glow: "shadow-[0_0_40px_rgba(249,115,22,0.12)]", icon: "bg-orange-500/15 text-orange-400", ring: "ring-orange-500/20" },
    emerald: { border: "border-emerald-500/30", glow: "shadow-[0_0_40px_rgba(16,185,129,0.12)]", icon: "bg-emerald-500/15 text-emerald-400", ring: "ring-emerald-500/20" },
  };
  const c = colors[glowColor];
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-[#060608] border rounded-[28px] p-7 transition-all duration-500 overflow-hidden ${c.border} ${c.glow} ring-1 ${c.ring}`}
    >
      {/* Subtle mesh grain */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      
      {/* Corner bracket accent */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-[28px] opacity-40" style={{ borderColor: "inherit" }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-[28px] opacity-40" style={{ borderColor: "inherit" }} />

      <div className="flex items-center gap-4 mb-6">
        <StepBadge num={step} active={active} done={false} />
        <div className={`p-2 rounded-xl ${c.icon}`}>{icon}</div>
        <h2 className="text-lg font-black tracking-tight">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

// ─── Holographic Phone Preview ──────────────────────────────────────────────
function PhonePreview({ keywords, isAiEnabled, brandTone, replyMessage }: {
  keywords: string; isAiEnabled: boolean; brandTone: string; replyMessage: string;
}) {
  const keyword = keywords.split(",")[0]?.trim() || "link";
  return (
    <div className="relative mx-auto" style={{ width: 220 }}>
      {/* Phone shell */}
      <div className="relative rounded-[40px] border-2 border-white/10 bg-[#08080c] shadow-[0_0_60px_rgba(139,92,246,0.2),inset_0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ paddingBottom: "210%", height: 0 }}>

        {/* Screen glow */}
        <div className="absolute inset-0 flex flex-col pt-8 px-3 pb-4 gap-3 text-[11px]">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-white/10 backdrop-blur-lg" />

          {/* Status bar */}
          <div className="flex justify-between text-white/20 font-bold text-[9px] px-2 pt-2">
            <span>9:41</span><span>●●●</span>
          </div>

          {/* DM header */}
          <div className="flex items-center gap-2 px-1 py-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 flex items-center justify-center text-[8px] font-black text-white shrink-0">AI</div>
            <div>
              <p className="font-black text-[10px] text-white leading-none">AutoDM</p>
              <p className="text-white/30 text-[8px]">Active now</p>
            </div>
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </div>

          {/* Chat bubbles area */}
          <div className="flex-1 flex flex-col gap-2 overflow-hidden px-1">
            {/* User bubble */}
            <motion.div
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="self-start max-w-[80%] bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2 backdrop-blur-md"
            >
              <p className="text-white/80 leading-snug">Hey! Interested in the <span className="text-violet-400 font-bold">{keyword}</span> 🚀</p>
            </motion.div>

            {/* Typing / AI indicator */}
            {isAiEnabled && (
              <div className="self-end flex items-center gap-1">
                <span className="text-violet-400/60 text-[8px] font-black uppercase tracking-widest">AI generating</span>
                <div className="flex gap-0.5">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <motion.span key={i} className="w-0.5 h-0.5 rounded-full bg-violet-400"
                      animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.8, delay: d, repeat: Infinity }} />
                  ))}
                </div>
              </div>
            )}

            {/* Reply bubble */}
            <motion.div
              key={isAiEnabled ? "ai" : "static"}
              initial={{ opacity: 0, x: 10, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: 0.6 }}
              className="self-end max-w-[85%]"
            >
              <div className={`rounded-2xl rounded-tr-sm px-3 py-2 shadow-lg ${isAiEnabled
                ? "bg-gradient-to-br from-violet-700/80 to-purple-900/80 border border-violet-500/30 backdrop-blur-md"
                : "bg-gradient-to-br from-violet-600 to-fuchsia-700 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                }`}>
                {isAiEnabled ? (
                  <div>
                    <p className="text-white/90 italic">✨ Personalized reply...</p>
                    <p className="text-violet-300/50 text-[8px] font-black uppercase mt-1">{brandTone}</p>
                  </div>
                ) : (
                  <p className="text-white leading-snug line-clamp-4">{replyMessage || "Your DM here..."}</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Bottom input mockup */}
          <div className="mx-1 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 flex items-center gap-2">
            <span className="flex-1 text-white/20 text-[9px]">Message...</span>
            <div className="w-4 h-4 rounded-full bg-violet-600/80 flex items-center justify-center">
              <ArrowRight className="w-2 h-2 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Side buttons */}
      <div className="absolute right-[-3px] top-20 w-[3px] h-8 rounded-l-full bg-white/10" />
      <div className="absolute left-[-3px] top-16 w-[3px] h-6 rounded-r-full bg-white/10" />
      <div className="absolute left-[-3px] top-24 w-[3px] h-6 rounded-r-full bg-white/10" />
    </div>
  );
}


export default function AutomationBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [name, setName] = useState("Course Link AI Assistant");
  const [triggerType, setTriggerType] = useState("comment");
  const [keywords, setKeywords] = useState("course, link");
  const [replyMessage, setReplyMessage] = useState("Hey there! Here's the link you requested: https://example.com/course");
  const [postId, setPostId] = useState("all");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [brandTone, setBrandTone] = useState("Friendly & Natural");
  const [goal, setGoal] = useState("Move user to DM & Provide link");

  // Instagram post picker
  const [igPosts, setIgPosts]           = useState<any[]>([]);
  const [igPostsLoading, setIgPostsLoading] = useState(false);
  const [igPostsError, setIgPostsError] = useState("");
  const [targetMode, setTargetMode]     = useState<"all" | "specific">("all");

  const loadIgPosts = async () => {
    setIgPostsLoading(true);
    setIgPostsError("");
    try {
      const res  = await fetch("/api/instagram/media");
      const data = await res.json();
      if (data.error || !data.media) setIgPostsError(data.error || "No media found.");
      else setIgPosts(data.media);
    } catch { setIgPostsError("Failed to load posts."); }
    finally { setIgPostsLoading(false); }
  };

  useEffect(() => {
    async function fetchAutomation() {
      if (editId) {
        try {
          const res = await fetch(`/api/automations/${editId}`);
          if (res.ok) {
            const data = await res.json();
            setName(data.name);
            setKeywords(Array.isArray(data.keywords) ? data.keywords.join(", ") : data.keywords);
            setReplyMessage(data.response_message || "");
            setPostId(data.post_id || "all");
            setTriggerType(data.trigger_type || "comment");
            setIsAiEnabled(!!data.is_ai_enabled);
            setBrandTone(data.brand_tone || "Friendly & Natural");
            setGoal(data.goal || "Move user to DM & Provide link");
          }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
      }
    }
    fetchAutomation();
  }, [editId]);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const url = editId ? `/api/automations/${editId}` : "/api/automations";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, keywords, response_message: isAiEnabled ? "" : replyMessage, trigger_type: triggerType, post_id: postId, is_ai_enabled: isAiEnabled, brand_tone: brandTone, goal }),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Save error:", errData);
        alert(`Failed to save automation: ${errData.message || res.statusText}`);
      }
    } catch (error) { 
      console.error(error); 
      alert("Network error: Failed to save automation");
    }
    finally { setIsSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[60vh]">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-violet-500/30 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  const inputClass = "w-full bg-black/60 border border-white/8 rounded-2xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/40 transition-all duration-200 font-medium text-sm";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  return (
    <div className="min-h-screen relative text-white">

      {/* ── Background atmosphere ──── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-violet-700/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-fuchsia-700/10 rounded-full blur-[120px]" />
        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">

        {/* ── Top Header Bar ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/30 font-bold uppercase tracking-widest mb-2">
              <Link href="/dashboard" className="hover:text-white/60 transition-colors">Dashboard</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/dashboard" className="hover:text-white/60 transition-colors">Automations</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-violet-400">{editId ? "Edit" : "New"}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-400 bg-clip-text text-transparent">
                {editId ? "Edit Automation" : "Automation Builder"}
              </span>
              {isAiEnabled && (
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <Sparkles className="w-6 h-6 text-violet-400" />
                </motion.div>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/dashboard"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-all">
              Cancel
            </Link>
            <button
              onClick={handleSubmit} disabled={isSaving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-7 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(139,92,246,0.55)] disabled:opacity-50 hover:scale-105 active:scale-95">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
              {editId ? "Apply Changes" : "Save & Enable"}
            </button>
          </div>
        </div>

        {/* ── AI / Static mode pill ─────────────────────────── */}
        <div className="flex justify-start mb-8">
          <div className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-2xl p-1">
            <button
              onClick={() => setIsAiEnabled(false)}
              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${!isAiEnabled ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>
              <MessageSquareText className="w-3.5 h-3.5" />
              Static Message
            </button>
            <button
              onClick={() => setIsAiEnabled(true)}
              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${isAiEnabled ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]" : "text-white/30 hover:text-white/60"}`}>
              <Cpu className="w-3.5 h-3.5" />
              Neural AI Engine
            </button>
          </div>
        </div>

        {/* ── Main Layout ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Left: Flow Steps ─── */}
          <div className="lg:col-span-8">
            <div className="flex gap-5">

              {/* Node rail */}
              <div className="hidden sm:flex flex-col items-center pt-2 shrink-0">
                <StepBadge num={1} active={true} done={false} />
                <NodeConnector active={true} />
                <StepBadge num={2} active={!!name} done={false} />
                <NodeConnector active={!!name} />
                <StepBadge num={3} active={!!keywords} done={false} />
                <NodeConnector active={!!keywords} />
                <StepBadge num={4} active={!!keywords} done={false} />
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-5">

                {/* ─ Card 1: General Settings ─ */}
                <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
                  className="relative bg-[#06060a] border border-violet-500/20 rounded-[28px] p-7 shadow-[0_0_40px_rgba(139,92,246,0.08)] ring-1 ring-violet-500/10 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400"><Zap className="w-4 h-4" /></div>
                    <h2 className="font-black text-base">General Settings</h2>
                  </div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Automation Name</label>
                  <input type="text" placeholder="e.g. Black Friday Promo" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
                </motion.section>

                {/* ─ Card 2: Trigger Keyword ─ */}
                <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                  className="relative bg-[#06060a] border border-cyan-500/20 rounded-[28px] p-7 shadow-[0_0_40px_rgba(6,182,212,0.08)] ring-1 ring-cyan-500/10 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400"><MessageSquareText className="w-4 h-4" /></div>
                    <h2 className="font-black text-base">Trigger Keyword</h2>
                  </div>

                  {/* Trigger type selection */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button onClick={() => setTriggerType("comment")}
                      className={`relative p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-200 overflow-hidden
                        ${triggerType === "comment" ? "border-cyan-500/60 bg-cyan-500/5 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]" : "border-white/5 bg-white/[0.02] hover:border-white/15 text-white/30"}`}>
                      {triggerType === "comment" && <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />}
                      <MessageCircle className="w-7 h-7" />
                      <div className="text-center">
                        <p className="font-black text-sm">Post Comment</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${triggerType === "comment" ? "bg-cyan-500/20 text-cyan-300" : "bg-white/5 text-white/20"}`}>Recommended</span>
                      </div>
                    </button>
                    <button disabled
                      className="p-5 rounded-2xl border-2 border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-3 opacity-30 cursor-not-allowed text-white/30">
                      <Instagram className="w-7 h-7" />
                      <div className="text-center">
                        <p className="font-black text-sm">Direct Message</p>
                        <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded-full font-bold uppercase">Beta</span>
                      </div>
                    </button>
                  </div>

                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Keywords to Watch For</label>
                  <input type="text" placeholder="link, dm, price, course" className={inputClass} value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                  <p className="text-[11px] text-white/20 mt-2 font-medium">Comma-separated. Any comment containing these words will trigger the automation.</p>
                </motion.section>

                {/* ─ Card 3: Response Config ─ */}
                <AnimatePresence mode="wait">
                  {isAiEnabled ? (
                    <motion.section key="ai-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: 0.12 }}
                      className="relative bg-[#06060a] border border-fuchsia-500/20 rounded-[28px] p-7 shadow-[0_0_40px_rgba(217,70,239,0.08)] ring-1 ring-fuchsia-500/10 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />

                      <div className="flex items-center gap-3 mb-2">
                        <motion.div className="p-2 rounded-xl bg-fuchsia-500/15 text-fuchsia-400"
                          animate={{ boxShadow: ["0 0 0px rgba(217,70,239,0)", "0 0 20px rgba(217,70,239,0.3)", "0 0 0px rgba(217,70,239,0)"] }}
                          transition={{ duration: 2, repeat: Infinity }}>
                          <BrainCircuit className="w-4 h-4" />
                        </motion.div>
                        <h2 className="font-black text-base">AI Engine Config</h2>
                        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                          Neural Active
                        </div>
                      </div>
                      <p className="text-[11px] text-white/25 mb-7 font-medium pl-11">Our neural engine generates a unique human-like DM for every trigger.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                            <Target className="w-3 h-3" /> Brand Tone
                          </label>
                          <select className={selectClass} value={brandTone} onChange={(e) => setBrandTone(e.target.value)}>
                            <option>Friendly & Natural</option>
                            <option>Professional & Polished</option>
                            <option>Excited & Hyper</option>
                            <option>Helpful & Direct</option>
                            <option>Funny & Sarcastic</option>
                          </select>
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                            <LinkIcon className="w-3 h-3" /> Primary Goal
                          </label>
                          <select className={selectClass} value={goal} onChange={(e) => setGoal(e.target.value)}>
                            <option>Move user to DM & Provide link</option>
                            <option>Handle Support Inquiries</option>
                            <option>Generic Engagement Boost</option>
                            <option>Collect Feedback</option>
                          </select>
                        </div>
                      </div>

                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Additional Context / System Instructions</label>
                      <textarea rows={4} placeholder="e.g. We are launching a new course called 'NextJS Mastery'. If someone asks for price, say it's 50% off for early birds."
                        className={`${inputClass} resize-none`} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
                    </motion.section>
                  ) : (
                    <motion.section key="static-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: 0.12 }}
                      className="relative bg-[#06060a] border border-purple-500/20 rounded-[28px] p-7 shadow-[0_0_40px_rgba(168,85,247,0.08)] ring-1 ring-purple-500/10 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400"><MessageSquareText className="w-4 h-4" /></div>
                        <h2 className="font-black text-base">Static Response</h2>
                      </div>
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Fixed DM Message</label>
                      <textarea rows={6} className={`${inputClass} resize-none text-base`} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
                      <p className="text-[11px] text-white/20 mt-2 font-medium">Every triggered user will receive this exact message word-for-word.</p>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* ─ Card 4: Target Selection ─ */}
                <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                  className="relative bg-[#06060a] border border-orange-500/20 rounded-[28px] p-7 shadow-[0_0_40px_rgba(249,115,22,0.08)] ring-1 ring-orange-500/10 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400"><ImageIcon className="w-4 h-4" /></div>
                    <h2 className="font-black text-base">Target Selection</h2>
                  </div>

                  {/* All / Specific toggle */}
                  <div className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/8 rounded-2xl p-1 mb-6">
                    <button
                      onClick={() => { setTargetMode("all"); setPostId("all"); }}
                      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                        targetMode === "all" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
                      }`}>
                      All Posts
                    </button>
                    <button
                      onClick={() => {
                        setTargetMode("specific");
                        setPostId("");
                        if (igPosts.length === 0) loadIgPosts();
                      }}
                      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                        targetMode === "specific" ? "bg-orange-500/20 text-orange-300" : "text-white/30 hover:text-white/60"
                      }`}>
                      Specific Media
                    </button>
                  </div>

                  {/* Post picker */}
                  <AnimatePresence>
                    {targetMode === "specific" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-white/30 font-medium">
                            Select the post to monitor for comment triggers
                          </p>
                          <button
                            onClick={loadIgPosts}
                            disabled={igPostsLoading}
                            className="flex items-center gap-1.5 text-[11px] text-orange-400/70 hover:text-orange-300 transition-colors"
                          >
                            <RefreshCw className={`w-3 h-3 ${igPostsLoading ? "animate-spin" : ""}`} />
                            Refresh
                          </button>
                        </div>

                        {igPostsLoading ? (
                          // Skeleton grid
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} className="aspect-[9/16] rounded-xl bg-white/[0.04] animate-pulse" />
                            ))}
                          </div>
                        ) : igPostsError ? (
                          <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <Instagram className="w-10 h-10 text-orange-500/30" />
                            <p className="text-[12px] text-orange-400/70">{igPostsError}</p>
                            <p className="text-[11px] text-white/20">
                              Make sure your Instagram account is connected on the{" "}
                              <a href="/dashboard/instagram" className="text-orange-400 hover:underline">Instagram page</a>.
                            </p>
                          </div>
                        ) : igPosts.length === 0 ? (
                          <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <ImageIcon className="w-10 h-10 text-white/10" />
                            <p className="text-[12px] text-white/30">No posts found on your account.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[420px] overflow-y-auto pr-1"
                            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
                            {igPosts.map((post) => {
                              const selected = postId === post.id;
                              const isReel   = post.type === "VIDEO";
                              return (
                                <button
                                  key={post.id}
                                  type="button"
                                  onClick={() => setPostId(selected ? "" : post.id)}
                                  className={`relative aspect-[9/16] rounded-xl overflow-hidden group transition-all duration-200 ${
                                    selected
                                      ? "ring-2 ring-orange-400 ring-offset-1 ring-offset-[#06060a] scale-[0.97]"
                                      : "ring-1 ring-white/[0.06] hover:ring-orange-400/40 hover:scale-[0.98]"
                                  }`}
                                >
                                  {post.url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={post.url}
                                      alt={post.caption || "Post"}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-white/[0.04] flex items-center justify-center">
                                      <ImageIcon className="w-6 h-6 text-white/20" />
                                    </div>
                                  )}

                                  {/* Reel badge */}
                                  {isReel && (
                                    <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm rounded-full p-1">
                                      <Play className="w-2.5 h-2.5 text-white fill-white" />
                                    </div>
                                  )}

                                  {/* Selection overlay */}
                                  <div className={`absolute inset-0 transition-all duration-200 ${
                                    selected
                                      ? "bg-orange-500/25"
                                      : "bg-black/0 group-hover:bg-black/20"
                                  }`} />

                                  {/* Checkmark */}
                                  {selected && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                                        <Check className="w-4 h-4 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Show selected post ID */}
                        {postId && postId !== "all" && (
                          <div className="flex items-center gap-2 p-3 bg-orange-500/8 border border-orange-500/20 rounded-xl">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <p className="text-[11px] text-orange-300 font-mono truncate">Post ID: {postId}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>

              </div>{/* end cards */}
            </div>
          </div>

          {/* ── Right: Preview Panel ─── */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-6 space-y-5">

              {/* Phone mockup card */}
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                className="relative bg-[#06060a] border border-white/8 rounded-[32px] p-7 overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.08)]">

                {/* Decorative glow behind phone */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 bg-violet-600/10 rounded-full blur-3xl" />
                </div>

                <div className="relative flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Live Preview</p>
                    <p className="text-sm font-bold text-white mt-0.5">DM Simulation</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.div className="w-2 h-2 rounded-full bg-emerald-400"
                      animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>

                <PhonePreview keywords={keywords} isAiEnabled={isAiEnabled} brandTone={brandTone} replyMessage={replyMessage} />
              </motion.div>

              {/* Security badge */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex items-start gap-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-5">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5"><Shield className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">Secure Pipeline</p>
                  <p className="text-[11px] text-white/30 leading-relaxed font-medium">Automations run via our distributed worker queue, fully within Instagram's rate limits and Terms of Service.</p>
                </div>
              </motion.div>

              {/* Quick stats */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="grid grid-cols-2 gap-3">
                {[
                  { label: "Avg Response", value: "< 3s", icon: <Radio className="w-3 h-3" /> },
                  { label: "Mode", value: isAiEnabled ? "Neural AI" : "Static", icon: <Cpu className="w-3 h-3" /> },
                ].map((s) => (
                  <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
                    <div className="flex items-center gap-1.5 text-white/30 mb-2 text-[10px] font-bold uppercase tracking-widest">
                      {s.icon}{s.label}
                    </div>
                    <p className="text-base font-black text-white">{s.value}</p>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
