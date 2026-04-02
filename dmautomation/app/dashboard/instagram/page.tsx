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
  const isReel     = item.type === "VIDEO";
  const isCarousel = item.type === "CAROUSEL_ALBUM";

  return (
    <motion.a
      href={item.permalink}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -6, scale: 1.025 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className="group relative block rounded-2xl overflow-hidden bg-[#0f0f0f] border border-white/[0.05] hover:border-white/[0.12] shadow-lg hover:shadow-2xl hover:shadow-black/60 transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] overflow-hidden bg-[#0a0a0a]">
        {item.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.caption || "Post"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-[#222]" />
          </div>
        )}

        {/* Full-height gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400" />

        {/* Stats overlay — bottom left on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span className="text-white text-[11px] font-black">{item.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white text-[11px] font-black">{item.comments.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Type pill badge — top right */}
        {isReel && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full border border-white/10">
            <Play className="w-2.5 h-2.5 fill-white" />
            Reel
          </div>
        )}
        {isCarousel && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full border border-white/10">
            <LayoutGrid className="w-2.5 h-2.5" />
            Album
          </div>
        )}

        {/* Play icon for reels */}
        {isReel && (
          <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
              <Play className="w-4.5 h-4.5 text-white fill-white ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Caption + time */}
      <div className="px-3 py-2.5">
        <p className="text-[10.5px] text-[#3a3a3a] line-clamp-2 leading-relaxed mb-1">
          {item.caption || <span className="italic text-[#252525]">No caption</span>}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#282828]">{timeAgo(item.timestamp)}</span>
          <ExternalLink className="w-3 h-3 text-[#252525] group-hover:text-[#555] transition-colors" />
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
  const [igProfilePic, setIgProfilePic] = useState<string | null>(null);
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

          // Fetch real profile picture + username
          fetch("/api/instagram/profile")
            .then(r => r.json())
            .then(p => {
              if (p.username) setIgUsername(p.username);
              if (p.profilePic) setIgProfilePic(p.profilePic);
            })
            .catch(() => {});
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
  // CONNECTED — Premium Reels / Posts dashboard
  // ══════════════════════════════════════════════════════════════════════════
  if (connectionStatus === "connected") {
    const reelCount  = media.filter(m => m.type === "VIDEO").length;
    const photoCount = media.filter(m => m.type !== "VIDEO").length;

    return (
      <div className="min-h-screen bg-[#060608] text-white">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-gradient-to-bl from-pink-600/8 via-violet-600/5 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-violet-900/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-8">

          {/* ── Hero Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-8 rounded-3xl overflow-hidden"
          >
            {/* Header gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a1e] via-[#12081a] to-[#0d0610]" />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/15 via-violet-600/8 to-transparent" />
            <div className="absolute inset-0 border border-white/[0.05] rounded-3xl" />

            <div className="relative px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* Left: identity */}
              <div className="flex items-center gap-4">
                {/* Profile picture with live dot */}
                <div className="relative shrink-0">
                  {igProfilePic ? (
                    // Real Instagram profile photo
                    <div className="relative w-[58px] h-[58px] rounded-[18px] overflow-hidden ring-2 ring-white/10 shadow-2xl shadow-pink-900/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={igProfilePic}
                        alt={igUsername || "Instagram"}
                        className="w-full h-full object-cover"
                      />
                      {/* Subtle IG gradient ring overlay */}
                      <div className="absolute inset-0 rounded-[18px] ring-2 ring-inset ring-gradient-to-tr from-[#f09433] to-[#bc1888] opacity-30 pointer-events-none" />
                    </div>
                  ) : (
                    // Fallback: IG gradient icon
                    <div className="w-[58px] h-[58px] rounded-[18px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-2xl shadow-pink-900/30">
                      <Instagram className="w-7 h-7 text-white" />
                    </div>
                  )}
                  {/* Live green dot */}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#060608] flex items-center justify-center shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">● Connected</span>
                  </div>
                  <h1 className="text-[22px] font-black tracking-tight text-white leading-tight">
                    {igUsername ? `@${igUsername}` : "Your Instagram Content"}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {igUsername && (
                      <span className="text-[12px] text-[#666] font-medium">Instagram account</span>
                    )}
                    {igUsername && <span className="text-[#333]">·</span>}
                    <span className="text-[12px] text-[#555]">{media.length} posts</span>
                  </div>
                </div>
              </div>


              {/* Right: actions */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-[#555] hover:text-white border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.03] hover:bg-white/[0.06] px-3.5 py-2 rounded-xl transition-all"
                >
                  {isRefreshing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Refresh Token
                </button>

                <button
                  onClick={loadMedia}
                  disabled={mediaLoading}
                  className="flex items-center gap-1.5 text-[12px] font-black text-white px-4 py-2 rounded-xl transition-all bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 shadow-lg shadow-pink-900/25"
                >
                  {mediaLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Reload
                </button>

                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-[#444] hover:text-red-400 border border-white/[0.06] hover:border-red-500/20 bg-white/[0.02] px-3.5 py-2 rounded-xl transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Stat Cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="grid grid-cols-3 gap-3 mb-7"
          >
            {[
              { icon: Film,        gradient: "from-pink-500 to-rose-600",     shadow: "shadow-pink-500/20",    label: "Reels",  count: reelCount  },
              { icon: ImageIcon,   gradient: "from-violet-500 to-indigo-600", shadow: "shadow-violet-500/20", label: "Photos", count: photoCount },
              { icon: LayoutGrid,  gradient: "from-blue-500 to-cyan-500",     shadow: "shadow-blue-500/20",   label: "Total",  count: media.length },
            ].map(({ icon: Icon, gradient, shadow, label, count }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 overflow-hidden hover:border-white/[0.1] transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg ${shadow}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-[28px] font-black text-white tracking-tight leading-none mb-1">{count}</div>
                <div className="text-[12px] text-[#555] font-medium">{label}</div>
                {/* Subtle glow */}
                <div className={`absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br ${gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity`} />
              </motion.div>
            ))}
          </motion.div>

          {/* ── Filter tabs ── */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1">
              {(["ALL", "VIDEO", "IMAGE"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
                    filter === f
                      ? "bg-white text-black shadow-sm"
                      : "text-[#444] hover:text-[#888]"
                  }`}
                >
                  {f === "ALL"   && <LayoutGrid className="w-3.5 h-3.5" />}
                  {f === "VIDEO" && <Film       className="w-3.5 h-3.5" />}
                  {f === "IMAGE" && <ImageIcon  className="w-3.5 h-3.5" />}
                  {f === "ALL" ? "All" : f === "VIDEO" ? "Reels" : "Photos"}
                  <span className={`text-[10px] font-black ${ filter === f ? "text-black/40" : "text-[#333]"}`}>
                    {f === "ALL" ? media.length : f === "VIDEO" ? reelCount : photoCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {mediaError && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-2xl text-[13px] text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />{mediaError}
            </div>
          )}

          {/* ── Media Grid ── */}
          {mediaLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.05] overflow-hidden animate-pulse">
                  <div className="aspect-[9/16] bg-white/[0.04]" />
                  <div className="p-2.5 space-y-1.5">
                    <div className="h-2.5 bg-white/[0.04] rounded w-3/4" />
                    <div className="h-2 bg-white/[0.03] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center mb-5 opacity-15">
                <Instagram className="w-9 h-9 text-white" />
              </div>
              <p className="text-[#333] font-bold mb-1">No posts found</p>
              <p className="text-[#282828] text-[13px]">
                {filter !== "ALL" ? "Try switching to 'All'" : "No media on this account."}
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
            >
              {filteredMedia.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 260, damping: 22 }}
                >
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
