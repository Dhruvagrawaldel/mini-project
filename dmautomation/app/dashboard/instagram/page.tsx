"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Instagram,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Loader2,
  RefreshCw,
  Play,
  Heart,
  MessageSquare,
  Film,
  ImageIcon,
  LayoutGrid,
  LogOut,
  User,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface MediaItem {
  id: string;
  caption: string;
  type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  url: string;
  videoUrl: string | null;
  timestamp: string;
  permalink: string;
  likes: number;
  comments: number;
}

const PERKS = [
  { icon: Film,       color: "pink",    label: "View All Reels",    desc: "See every reel you've posted, in one place." },
  { icon: Zap,        color: "violet",  label: "AI DM Automation",  desc: "Auto-reply to comments with smart, personalised messages." },
  { icon: TrendingUp, color: "blue",    label: "Analytics",         desc: "Track DM volume, engagement rates and growth." },
  { icon: Shield,     color: "emerald", label: "Secure & Private",  desc: "OAuth login — we never see your password." },
];

const PERK_COLOR: Record<string, string> = {
  pink:    "text-pink-400 bg-pink-400/10 border-pink-400/20",
  violet:  "text-violet-400 bg-violet-400/10 border-violet-400/20",
  blue:    "text-blue-400 bg-blue-400/10 border-blue-400/20",
  emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

// ─── Media Card ────────────────────────────────────────────────────────────────
function MediaCard({ item }: { item: MediaItem }) {
  const isReel = item.type === "VIDEO";
  return (
    <motion.a
      href={item.permalink}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group block rounded-2xl overflow-hidden bg-[#111] border border-[#1a1a1a] hover:border-[#333]"
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-[#0d0d0d]">
        {item.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={item.caption || "Post"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-[#333]" />
          </div>
        )}

        {/* Hover stats */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 fill-current text-pink-400" /><span className="text-xs font-bold">{item.likes.toLocaleString()}</span></div>
            <div className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /><span className="text-xs font-bold">{item.comments.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Badges */}
        {isReel && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10">
            <Play className="w-2.5 h-2.5 fill-current" /> Reel
          </div>
        )}
        {item.type === "CAROUSEL_ALBUM" && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10">
            <LayoutGrid className="w-2.5 h-2.5" /> Album
          </div>
        )}
        {isReel && (
          <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-0 transition-opacity pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-current ml-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-[11px] text-[#444] line-clamp-2 leading-relaxed mb-2">
          {item.caption || <span className="italic text-[#2a2a2a]">No caption</span>}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#2f2f2f]">{timeAgo(item.timestamp)}</span>
          <ExternalLink className="w-3 h-3 text-[#2a2a2a] group-hover:text-[#555] transition-colors" />
        </div>
      </div>
    </motion.a>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function InstagramIntegrationPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [connectionStatus, setConnectionStatus] = useState<"loading" | "idle" | "connected">("loading");
  const [igUsername, setIgUsername]   = useState("");
  const [igAccountId, setIgAccountId] = useState("");
  const [media, setMedia]             = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError]   = useState("");
  const [filter, setFilter]           = useState<"ALL" | "VIDEO" | "IMAGE">("ALL");
  const [oauthError, setOauthError]   = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual token fallback
  const [showTokenFallback, setShowTokenFallback] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [showToken, setShowToken]     = useState(false);
  const [tokenConnecting, setTokenConnecting] = useState(false);
  const [tokenError, setTokenError]   = useState("");

  // ── Load media ─────────────────────────────────────────────────────────────
  const loadMedia = useCallback(async () => {
    setMediaLoading(true);
    setMediaError("");
    try {
      const res  = await fetch("/api/instagram/media");
      const data = await res.json();
      if (data.error) setMediaError(data.error);
      else setMedia(data.media || []);
    } catch {
      setMediaError("Failed to load media from Instagram.");
    } finally {
      setMediaLoading(false);
    }
  }, []);

  // ── On mount ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session?.user) return;

    // Handle OAuth redirect params
    const connected = searchParams.get("connected");
    const username  = searchParams.get("username");
    const err       = searchParams.get("error");
    if (err) setOauthError(decodeURIComponent(err));

    (async () => {
      try {
        const res  = await fetch("/api/user/profile");
        const data = res.ok ? await res.json() : null;
        if (data?.ig_access_token && data?.ig_account_id) {
          setIgAccountId(data.ig_account_id);
          setIgUsername(username ? decodeURIComponent(username) : (connected ? "" : ""));
          setConnectionStatus("connected");
          loadMedia();
        } else {
          setConnectionStatus("idle");
        }
      } catch {
        setConnectionStatus("idle");
      }
    })();
  }, [session, searchParams, loadMedia]);

  // ── Disconnect ─────────────────────────────────────────────────────────────
  const handleDisconnect = async () => {
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ig_access_token: "", ig_account_id: "" }),
    });
    setIgUsername(""); setIgAccountId("");
    setMedia([]); setConnectionStatus("idle");
  };

  // ── Refresh token ──────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try { await fetch("/api/auth/instagram/refresh", { method: "POST" }); }
    catch { /* ignore */ }
    finally { setIsRefreshing(false); }
  };

  const filteredMedia = media.filter(m =>
    filter === "ALL" ? true : filter === "VIDEO" ? m.type === "VIDEO" : m.type !== "VIDEO"
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (connectionStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CONNECTED — show Reels / Posts grid
  // ══════════════════════════════════════════════════════════════════════════
  if (connectionStatus === "connected") {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-[10%] w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-violet-600/4 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-10">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-xl shadow-pink-900/20">
                  <Instagram className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#080808] flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Connected</span>
                <h1 className="text-2xl font-black tracking-tight">Your Instagram Content</h1>
                {igUsername && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <User className="w-3 h-3 text-[#555]" />
                    <span className="text-[#555] text-[13px]">@{igUsername}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button onClick={handleRefresh} disabled={isRefreshing}
                className="flex items-center gap-2 text-[13px] font-bold text-[#666] hover:text-white bg-[#111] border border-[#222] hover:border-[#333] px-4 py-2.5 rounded-xl transition-all">
                {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh Token
              </button>
              <button onClick={loadMedia} disabled={mediaLoading}
                className="flex items-center gap-2 text-[13px] font-bold text-white bg-gradient-to-r from-pink-500/80 to-violet-500/80 hover:from-pink-500 hover:to-violet-500 px-4 py-2.5 rounded-xl transition-all">
                {mediaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Reload
              </button>
              <button onClick={handleDisconnect}
                className="flex items-center gap-2 text-[13px] font-bold text-red-400/60 hover:text-red-400 bg-[#111] border border-[#222] hover:border-red-500/30 px-4 py-2.5 rounded-xl transition-all">
                <LogOut className="w-4 h-4" /> Disconnect
              </button>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="flex items-center gap-4 mb-6 p-4 bg-[#111] border border-[#1a1a1a] rounded-2xl">
            {[
              { icon: Film, color: "text-pink-400", label: "Reels", count: media.filter(m => m.type === "VIDEO").length },
              { icon: ImageIcon, color: "text-violet-400", label: "Photos", count: media.filter(m => m.type !== "VIDEO").length },
              { icon: LayoutGrid, color: "text-blue-400", label: "Total", count: media.length },
            ].map(({ icon: Icon, color, label, count }, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px]">
                {i > 0 && <div className="w-px h-4 bg-[#222] mr-2" />}
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-[#666]">{label}:</span>
                <span className="text-white font-bold">{count}</span>
              </div>
            ))}
          </motion.div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-6">
            {(["ALL", "VIDEO", "IMAGE"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
                  filter === f ? "bg-white text-black" : "bg-[#111] border border-[#1a1a1a] text-[#555] hover:text-white hover:border-[#2a2a2a]"
                }`}>
                {f === "ALL" && <LayoutGrid className="w-3.5 h-3.5" />}
                {f === "VIDEO" && <Film className="w-3.5 h-3.5" />}
                {f === "IMAGE" && <ImageIcon className="w-3.5 h-3.5" />}
                {f === "ALL" ? "All" : f === "VIDEO" ? "Reels" : "Photos"}
                <span className="opacity-50 text-[10px]">
                  ({f === "ALL" ? media.length : f === "VIDEO" ? media.filter(m => m.type === "VIDEO").length : media.filter(m => m.type !== "VIDEO").length})
                </span>
              </button>
            ))}
          </div>

          {mediaError && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-[13px] text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />{mediaError}
            </div>
          )}

          {/* Grid */}
          {mediaLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-[#111] border border-[#1a1a1a] overflow-hidden animate-pulse">
                  <div className="aspect-[9/16] bg-[#161616]" />
                  <div className="p-3 space-y-2"><div className="h-3 bg-[#161616] rounded w-3/4" /><div className="h-2 bg-[#161616] rounded w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center mb-5 opacity-20">
                <Instagram className="w-9 h-9 text-white" />
              </div>
              <p className="text-[#444] font-bold mb-1">No posts found</p>
              <p className="text-[#333] text-[13px]">{filter !== "ALL" ? "Try switching to 'All'" : "No media on this account."}</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredMedia.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.035 }}>
                  <MediaCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // NOT CONNECTED — clean "Login with Instagram" screen
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6">
      {/* Ambient side glows matching the screenshot */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-pink-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[500px] bg-pink-900/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">

        {/* OAuth error */}
        <AnimatePresence>
          {oauthError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 flex items-center gap-3 p-4 bg-red-500/8 border border-red-500/20 rounded-2xl text-[13px] text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />{oauthError}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        >
          <div className="relative bg-[#0e0e0e] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl">

            {/* ── Instagram gradient header ── */}
            <div className="relative h-48 bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex flex-col items-center justify-center gap-3 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.18),transparent_60%)]" />

              {/* Frosted glass Instagram icon tile */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="relative z-10 w-[72px] h-[72px] rounded-[20px] flex items-center justify-center shadow-2xl"
                style={{
                  background: "rgba(255,255,255,0.22)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.35)",
                }}
              >
                <Instagram className="w-8 h-8 text-white drop-shadow-md" />
              </motion.div>

              <p className="relative z-10 text-white/75 text-[13px] font-semibold tracking-wide">
                Instagram Integration
              </p>
            </div>

            {/* ── Body ── */}
            <div className="px-8 py-8">
              <div className="text-center mb-7">
                <h1 className="text-[26px] font-black text-white tracking-tight mb-2">
                  Connect Your Account
                </h1>
                <p className="text-[#555] text-[13.5px] leading-relaxed">
                  Click below to securely log in with Instagram.<br />
                  No passwords, no tokens — just one click.
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-2 gap-3 mb-7">
                {PERKS.map(({ icon: Icon, color, label, desc }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-white/10 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${PERK_COLOR[color]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[13px] font-bold text-white mb-0.5">{label}</p>
                    <p className="text-[11.5px] text-[#444] leading-snug">{desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Login button */}
              <a
                href="/api/auth/instagram/authorize"
                className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-[16px] text-white overflow-hidden shadow-xl shadow-pink-900/25 transition-all active:scale-[0.98] hover:shadow-pink-900/40"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_70%)]" />
                <Instagram className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Login with Instagram</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* ── Manual token fallback ── */}
              <div className="mt-4">
                <button
                  onClick={() => { setShowTokenFallback(v => !v); setTokenError(""); }}
                  className="w-full text-center text-[12px] text-[#333] hover:text-[#666] transition-colors py-1"
                >
                  {showTokenFallback ? "▲ Hide" : "▼ Having trouble? Paste a token manually"}
                </button>

                <AnimatePresence>
                  {showTokenFallback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl space-y-3">
                        <p className="text-[11px] text-[#444] leading-relaxed">
                          Generate a token from{" "}
                          <a
                            href="https://developers.facebook.com/apps/1655725885687741/instagram-basic-display/basic-display/"
                            target="_blank" rel="noopener noreferrer"
                            className="text-violet-400 hover:underline"
                          >
                            Meta App → Instagram Basic Display → User Token Generator
                          </a>
                          {" "}and paste it below.
                        </p>

                        <div className="relative">
                          <textarea
                            rows={3}
                            value={manualToken}
                            onChange={e => setManualToken(e.target.value)}
                            placeholder="Paste your access token here…"
                            className="w-full bg-[#0d0d0d] border border-[#1d1d1d] rounded-xl px-4 py-3 text-[13px] text-white font-mono placeholder:text-[#2a2a2a] focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/15 transition-all resize-none"
                            style={{ WebkitTextSecurity: showToken ? "none" : "disc" } as React.CSSProperties}
                          />
                          <button
                            type="button"
                            onClick={() => setShowToken(v => !v)}
                            className="absolute top-2.5 right-3 text-[11px] text-[#444] hover:text-[#888] transition-colors"
                          >
                            {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {tokenError && (
                          <div className="flex items-center gap-2 text-[12px] text-red-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />{tokenError}
                          </div>
                        )}

                        <button
                          disabled={!manualToken.trim() || tokenConnecting}
                          onClick={async () => {
                            setTokenConnecting(true);
                            setTokenError("");
                            try {
                              const res = await fetch("/api/instagram/connect", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ token: manualToken }),
                              });
                              const data = await res.json();
                              if (!res.ok) { setTokenError(data.message || "Invalid token"); return; }
                              setIgAccountId(data.accountId);
                              setIgUsername(data.username || "");
                              setConnectionStatus("connected");
                              loadMedia();
                            } catch { setTokenError("Unexpected error. Try again."); }
                            finally { setTokenConnecting(false); }
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {tokenConnecting
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</>
                            : <><Zap className="w-4 h-4" /> Connect with Token</>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-center text-[11px] text-[#333] mt-3 leading-relaxed">
                By connecting, you agree to Instagram&apos;s Terms of Service. We request{" "}
                <span className="text-[#555] font-semibold">read-only</span> access to your profile and media.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
