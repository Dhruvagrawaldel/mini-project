"use client";

import { useState, useEffect } from "react";
import {
  Instagram,
  Shield,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Loader2,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  MessageCircle,
  Hash,
  TrendingUp,
  Globe,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Create a Meta App",
    desc: "Set up a developer app in the Meta Developers Console.",
    link: "https://developers.facebook.com/",
    linkLabel: "Open Console",
  },
  {
    num: "02",
    title: "Link Instagram Business Account",
    desc: "Under the app settings, add your Instagram Business profile.",
    link: null,
    linkLabel: null,
  },
  {
    num: "03",
    title: "Generate a Long-Lived Token",
    desc: "Use the Access Token Debugger to exchange for a 60-day token.",
    link: "https://developers.facebook.com/tools/debug/accesstoken/",
    linkLabel: "Token Debugger",
  },
  {
    num: "04",
    title: "Register the Webhook",
    desc: "Point the Instagram webhook to your endpoint below and subscribe to 'comments'.",
    link: null,
    linkLabel: null,
  },
];

const FEATURES = [
  { icon: MessageCircle, color: "violet", label: "Auto-Reply DMs", desc: "Respond to every keyword comment instantly." },
  { icon: Hash, color: "pink", label: "Keyword Triggers", desc: "Target words like 'price', 'link', or 'info'." },
  { icon: TrendingUp, color: "emerald", label: "Analytics", desc: "Track DM volume, success rates, and trends." },
  { icon: Zap, color: "amber", label: "AI Personalization", desc: "Generate unique replies per user, every time." },
];

const colorMap: Record<string, string> = {
  violet: "text-violet-400 bg-violet-400/10 border-violet-400/10",
  pink: "text-pink-400 bg-pink-400/10 border-pink-400/10",
  emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/10",
  amber: "text-amber-400 bg-amber-400/10 border-amber-400/10",
};

export default function InstagramIntegrationPage() {
  const { data: session } = useSession();
  const [igToken, setIgToken] = useState("");
  const [igAccountId, setIgAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedState, setSavedState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connected" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const webhookUrl = `${process.env.NEXT_PUBLIC_URL || "https://your-domain.com"}/api/webhooks/instagram`;

  useEffect(() => {
    if (session?.user) {
      const fetchUserData = async () => {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            setIgToken(data.ig_access_token || "");
            setIgAccountId(data.ig_account_id || "");
            if (data.ig_access_token && data.ig_account_id) {
              setConnectionStatus("connected");
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchUserData();
    }
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedState("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ig_access_token: igToken, ig_account_id: igAccountId }),
      });
      if (res.ok) {
        setSavedState("saved");
        setConnectionStatus("connected");
        setTimeout(() => setSavedState("idle"), 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to save");
        setSavedState("error");
        setConnectionStatus("error");
        setTimeout(() => setSavedState("idle"), 3000);
      }
    } catch {
      setErrorMsg("An unexpected error occurred");
      setSavedState("error");
      setTimeout(() => setSavedState("idle"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/instagram/refresh", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSavedState("saved");
        setTimeout(() => setSavedState("idle"), 3000);
      } else {
        setErrorMsg(data.message || "Refresh failed");
      }
    } catch {
      setErrorMsg("Failed to reach refresh service");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] right-[10%] w-[700px] h-[700px] bg-pink-600/4 rounded-full blur-[130px]" />
        <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] bg-violet-600/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center shadow-xl shadow-pink-900/20">
                <Instagram className="w-7 h-7 text-white" />
              </div>
              {connectionStatus === "connected" && (
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#080808] flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400 mb-1">Dashboard</p>
              <h1 className="text-3xl font-black tracking-tight text-white">Instagram Integration</h1>
              <p className="text-[#555] text-[14px] mt-0.5">Connect your Business account to activate AI DM automations.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {connectionStatus === "connected" ? (
              <>
                <div className="flex items-center gap-2 text-[13px] font-bold text-emerald-400 bg-emerald-400/8 border border-emerald-400/15 px-4 py-2.5 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 text-[13px] font-bold text-[#666] hover:text-white bg-[#111] border border-[#222] hover:border-[#333] px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Refresh Token
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-[13px] font-bold text-amber-400 bg-amber-400/8 border border-amber-400/15 px-4 py-2.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                Setup Required
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* === LEFT: Config Form === */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="xl:col-span-2 space-y-5"
          >
            {/* Config Card */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-[#1a1a1a] flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-white">API Credentials</h2>
                  <p className="text-[12px] text-[#444] mt-0.5">Your tokens are encrypted and never exposed publicly.</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-7">
                {/* Account ID */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-black text-[#444] uppercase tracking-[0.15em]">
                    Instagram Business Account ID
                  </label>
                  <input
                    type="text"
                    value={igAccountId}
                    onChange={(e) => setIgAccountId(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#1d1d1d] rounded-xl px-5 py-3.5 text-[15px] text-white font-mono placeholder:text-[#2a2a2a] focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/15 transition-all"
                    placeholder="17841401234567890"
                  />
                  <p className="text-[11px] text-[#3a3a3a] leading-relaxed">
                    Find this in Meta Events Manager → Data Sources → your Instagram page.
                  </p>
                </div>

                {/* Access Token */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-[#444] uppercase tracking-[0.15em]">
                      Long-Lived Access Token
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-[#444] hover:text-[#888] transition-colors"
                    >
                      {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showToken ? "Hide" : "Reveal"}
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={igToken}
                      onChange={(e) => setIgToken(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-[#1d1d1d] rounded-xl px-5 py-3.5 text-[14px] text-white font-mono placeholder:text-[#2a2a2a] focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/15 transition-all resize-none"
                      placeholder="IGQV..."
                      style={{ WebkitTextSecurity: showToken ? "none" : "disc" } as React.CSSProperties}
                    />
                  </div>

                  {/* Token Info */}
                  <div className="flex items-start gap-3 p-4 bg-[#0d0d0d] border border-[#1d1d1d] rounded-xl">
                    <AlertCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-[#555] leading-relaxed">
                      Tokens expire after <span className="text-violet-400 font-bold">60 days</span>. Use the "Refresh Token" button in the top bar to extend validity. Set a calendar reminder to refresh every 50 days.
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-2">
                  <AnimatePresence mode="wait">
                    {savedState === "saved" && (
                      <motion.div key="saved" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-[13px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Credentials saved!
                      </motion.div>
                    )}
                    {savedState === "error" && (
                      <motion.div key="error" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-[13px] font-semibold text-red-400">
                        <AlertCircle className="w-4 h-4" /> {errorMsg}
                      </motion.div>
                    )}
                    {(savedState === "idle" || savedState === "saving") && <span />}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={savedState === "saving"}
                    className="flex items-center gap-2.5 bg-white hover:bg-white/90 active:scale-[0.97] text-black px-7 py-3 rounded-xl text-[14px] font-black transition-all shadow-lg shadow-black/30 disabled:opacity-60"
                  >
                    {savedState === "saving" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 fill-current" />
                    )}
                    {savedState === "saving" ? "Saving…" : "Save Integration"}
                  </button>
                </div>
              </form>
            </div>

            {/* Webhook URL */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-4 h-4 text-[#444]" />
                <h3 className="text-[14px] font-bold text-[#888]">Webhook Endpoint</h3>
              </div>
              <div className="flex items-center gap-3 bg-[#0d0d0d] border border-[#1d1d1d] rounded-xl px-4 py-3 group">
                <code className="flex-1 text-[12px] text-violet-400 font-mono truncate">{webhookUrl}</code>
                <button
                  onClick={handleCopy}
                  className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-[#444] hover:text-white transition-colors bg-[#1a1a1a] hover:bg-[#222] px-3 py-1.5 rounded-lg"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-[11px] text-[#3a3a3a] mt-3">Subscribe to <span className="text-[#555] font-semibold">comments</span> events. Use <span className="text-[#555] font-semibold">INSTAGRAM_VERIFY_TOKEN</span> from your <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[10px]">.env</code> as the verify token.</p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#2a2a2a] transition-colors group"
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-4 ${colorMap[feat.color]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[14px] font-bold text-white mb-1">{feat.label}</p>
                    <p className="text-[12px] text-[#444] leading-relaxed">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* === RIGHT: Setup Guide === */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5"
          >
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden sticky top-6">
              <div className="px-6 py-5 border-b border-[#1a1a1a]">
                <h2 className="text-[15px] font-black text-white">Quick Setup Guide</h2>
                <p className="text-[12px] text-[#444] mt-1">Follow these steps to go live in under 10 minutes.</p>
              </div>
              <div className="p-6">
                <ol className="relative space-y-0">
                  {/* Vertical line */}
                  <div className="absolute left-[22px] top-8 bottom-8 w-px bg-[#1d1d1d]" />

                  {STEPS.map((step, i) => (
                    <li key={i} className="relative flex gap-5 pb-7 last:pb-0">
                      <div className="shrink-0 w-11 h-11 rounded-2xl bg-[#0d0d0d] border border-[#1d1d1d] flex items-center justify-center z-10">
                        <span className="text-[11px] font-black text-[#444]">{step.num}</span>
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-[14px] font-bold text-white mb-1">{step.title}</p>
                        <p className="text-[12px] text-[#444] leading-relaxed mb-2">{step.desc}</p>
                        {step.link && (
                          <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            {step.linkLabel}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* CTA */}
              <div className="px-6 py-5 border-t border-[#1a1a1a] bg-[#0d0d0d]/50">
                <a
                  href="https://developers.facebook.com/docs/instagram-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full group"
                >
                  <div>
                    <p className="text-[13px] font-bold text-white">Full API Documentation</p>
                    <p className="text-[11px] text-[#444] mt-0.5">Instagram Graph API reference</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] group-hover:bg-violet-500/10 border border-[#222] group-hover:border-violet-500/20 flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4 text-[#555] group-hover:text-violet-400 transition-colors" />
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
