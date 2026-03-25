"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Instagram,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Camera,
  Shield,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [igAccountId, setIgAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedState, setSavedState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [activeTab, setActiveTab] = useState("profile");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      const fetchUserData = async () => {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            setIgAccountId(data.ig_account_id || "");
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
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setSavedState("saved");
        update({ name });
        setTimeout(() => setSavedState("idle"), 3000);
      } else {
        setSavedState("error");
        setTimeout(() => setSavedState("idle"), 3000);
      }
    } catch {
      setSavedState("error");
      setTimeout(() => setSavedState("idle"), 3000);
    }
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "integrations", label: "Integrations", icon: Instagram },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400 mb-3">Account</p>
          <h1 className="text-4xl font-black tracking-tight text-white">Settings</h1>
          <p className="text-[#666] mt-2 text-[15px]">Manage your profile, integrations, and preferences.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:w-64 shrink-0"
          >
            {/* Avatar Card */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-4 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-violet-900/30">
                  {initials}
                </div>
                <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-[#222] border border-[#333] rounded-xl flex items-center justify-center hover:bg-[#2a2a2a] transition-colors">
                  <Camera className="w-3.5 h-3.5 text-[#888]" />
                </button>
              </div>
              <p className="text-[15px] font-bold text-white truncate">{name || "Loading..."}</p>
              <p className="text-[12px] text-[#555] mt-0.5 truncate">{email}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-bold px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                Pro Plan
              </div>
            </div>

            {/* Tab Navigation */}
            <nav className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all text-left ${
                      isActive
                        ? "bg-white/[0.07] text-white"
                        : "text-[#555] hover:text-[#999] hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-violet-400" : ""}`} />
                    {tab.label}
                    {tab.id === "integrations" && !igAccountId && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
                      <div className="px-8 py-6 border-b border-[#1a1a1a]">
                        <h2 className="text-[17px] font-bold text-white">Profile Information</h2>
                        <p className="text-[13px] text-[#555] mt-1">Update your public display name.</p>
                      </div>

                      <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Full Name */}
                          <div className="space-y-2">
                            <label className="text-[12px] font-bold text-[#555] uppercase tracking-widest flex items-center gap-2">
                              <User className="w-3.5 h-3.5" />
                              Full Name
                            </label>
                            <div className="relative group">
                              <input
                                ref={inputRef}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0d0d0d] border border-[#222] rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-[#333] focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                                placeholder="Your full name"
                              />
                              <div className="absolute inset-0 rounded-xl ring-1 ring-violet-500/0 group-focus-within:ring-violet-500/20 pointer-events-none transition-all" />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <label className="text-[12px] font-bold text-[#555] uppercase tracking-widest flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5" />
                              Email Address
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full bg-[#0d0d0d]/50 border border-[#1a1a1a] rounded-xl px-4 py-3.5 text-[15px] text-[#444] cursor-not-allowed"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <span className="text-[10px] font-bold text-[#333] bg-[#1a1a1a] px-2 py-1 rounded-md">LOCKED</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-[#3a3a3a] pl-0.5">Email address is tied to your login and cannot be changed.</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-8 py-5 border-t border-[#1a1a1a] bg-[#0d0d0d]/40 flex items-center justify-between">
                        <AnimatePresence mode="wait">
                          {savedState === "saved" && (
                            <motion.span
                              key="saved"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2 text-[13px] font-semibold text-emerald-400"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Changes saved
                            </motion.span>
                          )}
                          {savedState === "error" && (
                            <motion.span
                              key="error"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2 text-[13px] font-semibold text-red-400"
                            >
                              <AlertCircle className="w-4 h-4" />
                              Failed to save
                            </motion.span>
                          )}
                          {savedState === "idle" && <span />}
                        </AnimatePresence>

                        <button
                          type="submit"
                          disabled={savedState === "saving"}
                          className="flex items-center gap-2.5 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-lg shadow-violet-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savedState === "saving" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {savedState === "saving" ? "Saving…" : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === "integrations" && (
                <motion.div
                  key="integrations"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-[#1a1a1a]">
                      <h2 className="text-[17px] font-bold text-white">Connected Accounts</h2>
                      <p className="text-[13px] text-[#555] mt-1">Manage third-party integrations and API access.</p>
                    </div>

                    <div className="p-6">
                      {/* Instagram Row */}
                      <Link href="/dashboard/instagram">
                        <div className="group flex items-center gap-5 p-5 rounded-2xl border border-[#1a1a1a] hover:border-[#2a2a2a] hover:bg-white/[0.02] transition-all cursor-pointer">
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center shadow-lg">
                              <Instagram className="w-6 h-6 text-white" />
                            </div>
                            {igAccountId ? (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#111] flex items-center justify-center">
                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                              </div>
                            ) : (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-[#111] animate-pulse" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-1">
                              <p className="text-[15px] font-bold text-white">Instagram Business</p>
                              {igAccountId ? (
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                                  Active
                                </span>
                              ) : (
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                                  Setup Required
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] text-[#555] truncate">
                              {igAccountId ? `Account ID: ${igAccountId}` : "Connect to enable automated DM responses"}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center gap-3">
                            <span className="text-[13px] font-semibold text-[#444] group-hover:text-[#666] transition-colors">
                              {igAccountId ? "Manage" : "Connect"}
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] group-hover:bg-[#222] flex items-center justify-center transition-colors">
                              <ArrowUpRight className="w-4 h-4 text-[#555] group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Info box */}
                  {!igAccountId && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-4 p-5 bg-amber-500/5 border border-amber-500/15 rounded-2xl"
                    >
                      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[14px] font-bold text-amber-300 mb-1">Instagram not connected</p>
                        <p className="text-[13px] text-[#666] leading-relaxed">
                          Your automations won't run until Instagram is connected. Head to the{" "}
                          <Link href="/dashboard/instagram" className="text-amber-400 hover:underline font-semibold">
                            Instagram Integration
                          </Link>{" "}
                          page to complete setup.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-[#1a1a1a]">
                      <h2 className="text-[17px] font-bold text-white">Security</h2>
                      <p className="text-[13px] text-[#555] mt-1">Manage your account security settings.</p>
                    </div>
                    <div className="p-8 space-y-4">
                      {[
                        { label: "Two-Factor Authentication", description: "Add an extra layer of security", badge: "Recommended", badgeColor: "violet" },
                        { label: "Active Sessions", description: "View and manage logged-in devices", badge: "1 Active", badgeColor: "emerald" },
                        { label: "API Access Keys", description: "Manage developer access tokens", badge: "None", badgeColor: "gray" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-5 rounded-2xl border border-[#1a1a1a] hover:border-[#2a2a2a] hover:bg-white/[0.02] transition-all cursor-pointer group"
                        >
                          <div>
                            <p className="text-[14px] font-bold text-white mb-0.5">{item.label}</p>
                            <p className="text-[12px] text-[#555]">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              item.badgeColor === "violet" ? "text-violet-400 bg-violet-400/10 border-violet-400/20" :
                              item.badgeColor === "emerald" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
                              "text-[#444] bg-[#1a1a1a] border-[#222]"
                            }`}>
                              {item.badge}
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#333] group-hover:text-[#666] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
