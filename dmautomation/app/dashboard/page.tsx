"use client";

import Link from "next/link";
import { Plus, MessageSquare, Clock, Zap, MoreVertical, Play, Pause, Loader2, Instagram, AlertCircle, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AutomationData {
  id: string;
  name: string;
  keywords: string[];
  response_message: string;
  is_active: boolean;
  created_at: string;
}

const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.2, 0.8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized coordinates from -0.5 to 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        filter: useMotionTemplate`brightness(${brightness})`,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative w-full perspective-1000 ${className}`}
    >
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="h-full w-full rounded-2xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-2xl backdrop-blur-md"
      >
        <div className="h-full w-full rounded-2xl bg-black/60 p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const [automations, setAutomations] = useState<AutomationData[]>([]);
  const [stats, setStats] = useState({ activeRules: 0, totalSent: 0, hoursSaved: 0 });
  const [loading, setLoading] = useState(true);
  const [isInstagramConnected, setIsInstagramConnected] = useState(true); // Default to true to avoid flash

  useEffect(() => {
    async function fetchData() {
      try {
        const [autoRes, statsRes, profileRes] = await Promise.all([
          fetch("/api/automations"),
          fetch("/api/analytics"),
          fetch("/api/user/profile")
        ]);

        if (autoRes.ok) {
          const data = await autoRes.json();
          setAutomations(data);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.summary);
        }

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setIsInstagramConnected(!!(profile.ig_access_token && profile.ig_account_id));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/automations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (res.ok) {
        setAutomations(prev => prev.map(a => a.id === id ? { ...a, is_active: !currentStatus } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-black">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden perspective-1000 p-6 md:p-10 text-foreground">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
        >
          <div style={{ transform: "translateZ(50px)" }}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-2xl">
              Automations
            </h1>
            <p className="text-muted-foreground/80 text-lg max-w-lg shadow-black drop-shadow-md">
              Manage your Instagram DM automations and witness scaling in 3D perspective.
            </p>
          </div>
          
          <motion.div style={{ transform: "translateZ(60px)" }}>
            <Link href="/dashboard/builder" className="group relative flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/20 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]">
              <span className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
              <Plus className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-90 duration-300" />
              <span className="relative z-10">Create New</span>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 [perspective:1000px]">
          <motion.div initial={{ opacity: 0, z: -100, rotateY: -30 }} animate={{ opacity: 1, z: 0, rotateY: 0 }} transition={{ delay: 0.1, duration: 0.8 }}>
            <TiltCard>
              <div className="flex items-center gap-3 text-muted-foreground mb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <Zap className="w-5 h-5 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                </div>
                <h3 className="font-semibold text-white/80">Active Rules</h3>
              </div>
              <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-xl">{stats.activeRules}</p>
              <div className="text-sm font-medium text-primary mt-3 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                Currently running
              </div>
            </TiltCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, z: -100, rotateY: -30 }} animate={{ opacity: 1, z: 0, rotateY: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <TiltCard>
              <div className="flex items-center gap-3 text-muted-foreground mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <MessageSquare className="w-5 h-5 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                </div>
                <h3 className="font-semibold text-white/80">Total DMs Sent</h3>
              </div>
              <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-xl">{stats.totalSent.toLocaleString()}</p>
              <div className="text-sm font-medium text-blue-400 mt-3 drop-shadow-md">Historical volume</div>
            </TiltCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, z: -100, rotateY: -30 }} animate={{ opacity: 1, z: 0, rotateY: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <TiltCard>
              <div className="flex items-center gap-3 text-muted-foreground mb-4">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  <Clock className="w-5 h-5 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                </div>
                <h3 className="font-semibold text-white/80">Hours Saved</h3>
              </div>
              <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-xl">{stats.hoursSaved}</p>
              <div className="text-sm font-medium text-orange-400/80 mt-3">Estimated scale impact</div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Connection Warning */}
        {!isInstagramConnected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:opacity-100 transition-opacity opacity-50" />
            <div className="relative bg-black/40 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
              <div className="bg-gradient-to-tr from-pink-500 to-yellow-500 p-4 rounded-2xl shadow-lg shadow-pink-500/20">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Instagram Not Connected
                </h2>
                <p className="text-white/60 text-sm max-w-xl">
                  Connect your Instagram Business account to start automating your DMs with AI. Your automations will remain inactive until a connection is established.
                </p>
              </div>
              <Link 
                href="/dashboard/instagram" 
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition-all active:scale-95 group/btn"
              >
                Connect Now
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
        
        {/* Automations List */}
        <motion.div 
          initial={{ opacity: 0, y: 50, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/15 to-white/5 shadow-2xl overflow-hidden [transform-style:preserve-3d]"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />
          <div className="relative z-10 bg-black/60 rounded-3xl overflow-hidden shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-gradient-to-b from-white/5 to-transparent">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 drop-shadow-md">Your Automations</h2>
              <button className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors duration-300">View all</button>
            </div>
            
            <div className="divide-y divide-white/5">
              {automations.map((auto, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  key={auto.id} 
                  className="group relative p-6 sm:p-8 hover:bg-white/[0.03] transition-all duration-300 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="flex items-start gap-5 flex-1 relative z-10">
                    <button 
                      onClick={() => toggleStatus(auto.id, auto.is_active)}
                      className={`relative p-4 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-xl group-hover:scale-110 group-hover:shadow-2xl ${
                        auto.is_active 
                        ? 'bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/30 shadow-primary/20' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/20'
                      }`}
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {auto.is_active ? <Play className="w-5 h-5 fill-current drop-shadow-[0_0_5px_rgba(var(--primary),0.8)]" /> : <Pause className="w-5 h-5 fill-current" />}
                    </button>
                    <div style={{ transform: "translateZ(10px)" }}>
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-3 text-white group-hover:text-primary transition-colors">
                        {auto.name}
                        {auto.is_active && (
                          <span className="flex h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)] animate-pulse" />
                        )}
                      </h3>
                      <div className="text-sm text-white/50 flex flex-wrap gap-x-6 gap-y-3 font-medium">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5"><span className="text-white/80">Trigger:</span> <span className="text-white">{auto.keywords.join(", ")}</span></span>
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5"><span className="text-white/80">Created:</span> <span className="text-white">{new Date(auto.created_at).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4 md:mt-0 self-end md:self-auto relative z-10" style={{ transform: "translateZ(15px)" }}>
                    <Link href={`/dashboard/builder?id=${auto.id}`} className="relative overflow-hidden px-6 py-2.5 text-sm font-bold bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1">
                      Edit
                    </Link>
                    <button className="p-3 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10 hover:shadow-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {automations.length === 0 && (
              <div className="p-16 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_50%)]" />
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-transparent p-[1px] mb-8 shadow-2xl"
                >
                  <div className="w-full h-full rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                    <Zap className="w-10 h-10 text-white/30 drop-shadow-md" />
                  </div>
                </motion.div>
                <h3 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 relative z-10">No automations yet</h3>
                <p className="text-lg text-white/50 max-w-md mb-10 relative z-10">Create your first keyword trigger to step into the future of automated DMs.</p>
                
                <Link href="/dashboard/builder" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary),0.5)] transition-all hover:scale-105 duration-300 z-10">
                  <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">Create Automation</span>
                  <Zap className="w-5 h-5 relative z-10 fill-current ml-2" />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
