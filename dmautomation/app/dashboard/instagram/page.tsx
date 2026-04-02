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
  { icon: Film,       gradient: "from-pink-500 to-rose-600",     glow: "shadow-pink-500/30",    border: "border-pink-500/20",    bg: "bg-pink-500/8",    text: "text-pink-300",    label: "View All Reels",    desc: "See every reel you've posted, right here." },
  { icon: Zap,        gradient: "from-violet-500 to-indigo-600", glow: "shadow-violet-500/30",  border: "border-violet-500/20",  bg: "bg-violet-500/8",  text: "text-violet-300",  label: "AI DM Automation", desc: "Auto-reply to comments with smart messages." },
  { icon: TrendingUp, gradient: "from-blue-500 to-cyan-500",     glow: "shadow-blue-500/30",    border: "border-blue-500/20",    bg: "bg-blue-500/8",    text: "text-blue-300",    label: "Analytics",        desc: "Track DM volume, engagement and growth." },
  { icon: Shield,     gradient: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/30", border: "border-emerald-500/20", bg: "bg-emerald-500/8", text: "text-emerald-300", label: "Secure & Private",  desc: "OAuth only — we never see your password." },
];

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
  // NOT CONNECTED — Premium "Login with Instagram" screen
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,54,255,0.28) 0%, rgba(139,92,246,0.10) 40%, #06040f 70%)" }}>

      {/* Deep space star-field ambient layers */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top center purple-indigo glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-gradient-to-b from-violet-700/35 via-indigo-700/20 to-transparent rounded-full blur-[120px]" />
        {/* Bottom-left accent */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px]" />
        {/* Bottom-right warm accent */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[350px] bg-purple-900/15 rounded-full blur-[90px]" />
        {/* Subtle pink for the IG brand */}
        <div className="absolute top-1/3 right-[5%] w-[300px] h-[300px] bg-pink-900/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Error */}
        <AnimatePresence>
          {oauthError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-5 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-[13px] text-red-400 backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />{oauthError}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="relative"
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-violet-500/40 via-indigo-500/20 to-pink-500/20 blur-[2px]" />
          <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-violet-600/15 via-transparent to-pink-600/10 blur-3xl" />

          {/* Card */}
          <div className="relative rounded-[26px] overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60"
            style={{ background: "rgba(12, 8, 28, 0.85)", backdropFilter: "blur(24px)" }}>

            {/* ── Glassmorphism Header ── */}
            <div className="relative overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]" />
              {/* Frosted glass overlay */}
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.12)", backdropFilter: "blur(0px)" }} />
              {/* Radial light burst */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.25),transparent_65%)]" />
              {/* Noise texture shimmer */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')]" />

              <div className="relative z-10 flex flex-col items-center justify-center gap-4 py-10 px-6">
                {/* Frosted glass tile */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1], y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                  className="relative"
                >
                  {/* Icon glow */}
                  <div className="absolute inset-0 rounded-[22px] bg-white/20 blur-lg" />
                  <div
                    className="relative w-20 h-20 rounded-[22px] flex items-center justify-center shadow-2xl"
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      backdropFilter: "blur(16px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,0.35)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
                    }}
                  >
                    <Instagram className="w-9 h-9 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
                  </div>
                </motion.div>

                <div className="text-center">
                  <p className="text-white font-black text-[15px] tracking-wide drop-shadow-md">Instagram Integration</p>
                  <p className="text-white/60 text-[12px] mt-0.5 font-medium">Connect once. Automate forever.</p>
                </div>
              </div>

              {/* Bottom fade into card */}
              <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#0c081c]/70 to-transparent" />
            </div>

            {/* ── Body ── */}
            <div className="px-7 pt-6 pb-7">
              <div className="text-center mb-6">
                <h1 className="text-[22px] font-black text-white tracking-tight leading-tight mb-2">
                  Connect Your Account
                </h1>
                <p className="text-[#6b6b8a] text-[13px] leading-relaxed">
                  One click to securely sign in with Instagram.<br />No passwords. No manual tokens.
                </p>
              </div>

              {/* ── Color-coded feature cards ── */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {PERKS.map(({ icon: Icon, gradient, glow, border, bg, text, label, desc }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className={`relative rounded-2xl p-4 border ${border} ${bg} overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
                    style={{ backdropFilter: "blur(8px)" }}
                  >
                    {/* Subtle inner glow on hover */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${gradient} opacity-[0.07]`} />
                    {/* Icon with gradient bg */}
                    <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-lg ${glow} bg-gradient-to-br ${gradient}`}>
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <p className={`text-[12.5px] font-black mb-0.5 ${text}`}>{label}</p>
                    <p className="text-[11px] text-[#4a4a6a] leading-snug">{desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* ── CTA Button ── */}
              <motion.a
                href="/api/auth/instagram/authorize"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center justify-center gap-3 w-full py-[15px] rounded-2xl font-black text-[15px] text-white overflow-hidden"
                style={{ boxShadow: "0 4px 32px rgba(220,39,67,0.4), 0 0 0 1px rgba(255,255,255,0.1)" }}
              >
                {/* Full Instagram gradient */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]" />
                {/* Shimmer sweep */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.18)_50%,transparent_70%)] bg-[size:200%] bg-[position:-100%] group-hover:bg-[position:200%]" />
                {/* Top shine */}
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                <Instagram className="w-5 h-5 relative z-10 drop-shadow-sm" />
                <span className="relative z-10 tracking-wide">Login with Instagram</span>
                <ArrowRight className="w-4.5 h-4.5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.a>

              <p className="text-center text-[11px] text-[#38385a] mt-4 leading-relaxed">
                By connecting, you agree to Instagram&apos;s Terms of Service.
                We request <span className="text-[#55557a] font-semibold">read-only</span> access to your media.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
