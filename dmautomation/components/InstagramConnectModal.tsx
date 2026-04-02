"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, X, ArrowRight, Zap, Shield, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

const PERKS = [
  { icon: Zap, label: "Auto-Reply DMs", desc: "Instantly reply to every keyword comment." },
  { icon: Shield, label: "Safe & Encrypted", desc: "Your tokens are secured and never exposed." },
  { icon: TrendingUp, label: "Track Analytics", desc: "Monitor DM volume and growth trends." },
  { icon: Sparkles, label: "AI Personalization", desc: "Generate unique replies per follower." },
];

export default function InstagramConnectModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show once per session and only if user hasn't connected Instagram
    const alreadyShown = sessionStorage.getItem("ig_modal_shown");
    if (alreadyShown) return;

    // Check if Instagram is connected
    fetch("/api/user/profile")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && !(data.ig_access_token && data.ig_account_id)) {
          // Slight delay so dashboard loads first
          setTimeout(() => {
            setOpen(true);
            sessionStorage.setItem("ig_modal_shown", "1");
          }, 1200);
        }
      })
      .catch(() => {});
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99] bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-lg pointer-events-auto">
              {/* Glow */}
              <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-pink-600/30 via-violet-600/20 to-orange-500/20 blur-2xl" />

              {/* Card */}
              <div className="relative bg-[#0e0e0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header gradient band */}
                <div className="relative h-36 bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex flex-col items-center justify-center gap-2 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent_60%)]" />
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="relative z-10 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl"
                  >
                    <Instagram className="w-8 h-8 text-white drop-shadow-lg" />
                  </motion.div>
                </div>

                {/* Body */}
                <div className="px-8 py-7">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white tracking-tight mb-1.5">
                      Connect Instagram
                    </h2>
                    <p className="text-[#666] text-[13.5px] leading-relaxed max-w-sm mx-auto">
                      Link your Business account now to unlock AI-powered DM automation and start growing on autopilot.
                    </p>
                  </div>

                  {/* Perks grid */}
                  <div className="grid grid-cols-2 gap-3 mb-7">
                    {PERKS.map(({ icon: Icon, label, desc }, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-white/10 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500/10 to-violet-500/10 border border-pink-500/10 flex items-center justify-center mb-2.5">
                          <Icon className="w-4 h-4 text-pink-400" />
                        </div>
                        <p className="text-[13px] font-bold text-white mb-0.5">{label}</p>
                        <p className="text-[11px] text-[#555] leading-snug">{desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href="/dashboard/instagram"
                    onClick={handleClose}
                    className="group relative flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-black text-[15px] text-white overflow-hidden shadow-lg shadow-pink-900/20 transition-all active:scale-[0.97]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
                    <Instagram className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Connect Instagram Account</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    onClick={handleClose}
                    className="w-full mt-3 py-3 text-[13px] font-semibold text-[#444] hover:text-[#777] transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
