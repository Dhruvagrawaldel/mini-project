"use client";

import { MessageSquareText, Zap, Link as LinkIcon, Instagram, ChevronRight, Save, Play, Image as ImageIcon, Loader2, Sparkles, BrainCircuit, Target, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AutomationBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [name, setName] = useState("Course Link AI Assistant");
  const [triggerType, setTriggerType] = useState("comment");
  const [keywords, setKeywords] = useState("course, link");
  const [replyMessage, setReplyMessage] = useState("Hey there! Here is the link you requested: https://example.com/course");
  const [postId, setPostId] = useState("all");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);

  // AI Settings
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [brandTone, setBrandTone] = useState("Friendly & Natural");
  const [goal, setGoal] = useState("Move user to DM & Provide link");

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
        } catch (err) {
          console.error("Error fetching automation:", err);
        } finally {
          setLoading(false);
        }
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
        body: JSON.stringify({
          name,
          keywords,
          response_message: isAiEnabled ? "" : replyMessage,
          trigger_type: triggerType,
          post_id: postId,
          is_ai_enabled: isAiEnabled,
          brand_tone: brandTone,
          goal: goal,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto text-foreground relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Automations</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{editId ? 'Edit' : 'Create New'}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            {editId ? 'Edit Automation' : 'Automation Builder'}
            {isAiEnabled && <Sparkles className="w-6 h-6 text-primary animate-pulse" />}
          </h1>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <Link href="/dashboard" className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-foreground px-5 py-3 rounded-2xl font-bold transition-all">
            Cancel
          </Link>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/25 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {editId ? 'Apply Changes' : 'Save & Enable'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. General Info & Mode */}
          <section className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                1. General Settings
              </h2>
              
              {/* AI Toggle */}
              <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/10">
                <button 
                  onClick={() => setIsAiEnabled(false)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!isAiEnabled ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                >
                  Static message
                </button>
                <button 
                  onClick={() => setIsAiEnabled(true)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isAiEnabled ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white/60'}`}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  AI Engine
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-white/50 uppercase tracking-widest">Automation Internal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Black Friday Promo" 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* 2. Trigger Configuration */}
          <section className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <MessageSquareText className="w-5 h-5" />
              </div>
              2. Trigger Keyword
            </h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setTriggerType('comment')}
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${triggerType === 'comment' ? 'border-primary bg-primary/5 text-primary' : 'border-white/5 bg-white/[0.02] hover:border-white/20 text-white/40'}`}
                >
                  <MessageCircle className="w-8 h-8" />
                  <span className="font-bold">Post Comment</span>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full ${triggerType === 'comment' ? 'bg-primary/20' : 'bg-white/5'}`}>RECOMMENDED</div>
                </button>
                <button 
                  disabled
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all opacity-40 cursor-not-allowed border-white/5 bg-white/[0.02] text-white/20`}
                >
                  <Instagram className="w-8 h-8" />
                  <span className="font-bold">Direct Message</span>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">BETA ACCESS</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-white/50 uppercase tracking-widest">Keywords to watch for</label>
                <input 
                  type="text" 
                  placeholder="link, dm, price, course" 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-lg"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <p className="text-xs text-white/30 mt-3 font-medium">Keywords are comma separated. If a comment contains any of these, we trigger the automation.</p>
              </div>
            </div>
          </section>

          {/* 3. Action Selection (AI vs Static) */}
          <section className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isAiEnabled ? (
                <motion.div 
                  key="ai-mode"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-primary/20 text-primary animate-pulse shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                      <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">3. AI Engine Setup</h2>
                      <p className="text-sm text-white/40 font-medium italic">Our neural network will generate a unique human-like reply for every comment.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-3 text-white/50 uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-4 h-4" /> Brand Tone
                      </label>
                      <select 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold appearance-none"
                        value={brandTone}
                        onChange={(e) => setBrandTone(e.target.value)}
                      >
                        <option>Friendly & Natural</option>
                        <option>Professional & Polished</option>
                        <option>Excited & Hyper</option>
                        <option>Helpful & Direct</option>
                        <option>Funny & Sarcastic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 text-white/50 uppercase tracking-widest flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> Primary Goal
                      </label>
                      <select 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold appearance-none"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                      >
                        <option>Move user to DM & Provide link</option>
                        <option>Handle Support Inquiries</option>
                        <option>Generic Engagement Boost</option>
                        <option>Collect Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3 text-white/50 uppercase tracking-widest">Additional Context / System Instructions</label>
                    <textarea 
                      rows={4}
                      placeholder="e.g. We are launching a new course called 'NextJS Mastery'. If someone asks for price, say it's 50% off for early birds."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium resize-none shadow-inner"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="static-mode"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                      <MessageSquareText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">3. Static Response</h2>
                      <p className="text-sm text-white/40 font-medium">Every triggered user will receive this exact message.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3 text-white/50 uppercase tracking-widest">Fixed DM Message</label>
                    <textarea 
                      rows={6}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium resize-none shadow-inner text-lg"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 4. Target Post Selection */}
          <section className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              4. Target Selection
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-1.5 bg-black/30 rounded-2xl border border-white/10 self-start w-fit">
                <button 
                  onClick={() => setPostId('all')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${postId === 'all' ? 'bg-white/10 text-white shadow-md' : 'text-white/40 hover:text-white/60'}`}
                >
                  All Posts
                </button>
                <button 
                  onClick={() => setPostId('')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${postId !== 'all' ? 'bg-white/10 text-white shadow-md' : 'text-white/40 hover:text-white/60'}`}
                >
                  Specific Media
                </button>
              </div>

              {postId !== 'all' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-bold text-white/50 uppercase tracking-widest">Instagram Media ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 178414053030273" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                  />
                  <p className="text-xs text-white/30 font-medium">AutoDM will only monitor this specific post for comments.</p>
                </motion.div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <h3 className="font-bold text-white/80 uppercase tracking-widest text-xs">Live Interaction Simulation</h3>
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </div>
            
            <div className="space-y-8 relative z-10">
              {/* Comment Bubble */}
              <div className="space-y-2">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-black border border-black" />
                  </div>
                  <span className="text-xs font-bold text-white/60">user_interested</span>
                </div>
                <div className="bg-white/5 text-white/90 px-5 py-3.5 rounded-3xl rounded-tl-none text-sm border border-white/10 shadow-xl ml-11 backdrop-blur-md">
                  Hey! I'm interested in the <strong className="text-primary">{keywords.split(',')[0] || 'link'}</strong> for this! 🚀
                </div>
              </div>

              {/* Bot Processing Indicator */}
              {isAiEnabled && (
                <div className="flex items-center gap-3 ml-auto w-fit">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Neural Engine Generating</div>
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary animate-[pulse_0.8s_infinite]" />
                    <span className="w-1 h-1 rounded-full bg-primary animate-[pulse_0.8s_0.2s_infinite]" />
                    <span className="w-1 h-1 rounded-full bg-primary animate-[pulse_0.8s_0.4s_infinite]" />
                  </div>
                </div>
              )}

              {/* DM Bubble */}
              <div className="space-y-2 flex flex-col items-end">
                <div className="flex gap-3 items-center flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-[10px] shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    AI
                  </div>
                  <span className="text-xs font-bold text-white/60">AutoDM Assistant</span>
                </div>
                <div className={`relative overflow-hidden px-6 py-4 rounded-[28px] rounded-tr-none text-sm shadow-2xl transition-all duration-500 ${
                  isAiEnabled 
                  ? 'bg-white/10 text-white italic ring-1 ring-white/20' 
                  : 'bg-gradient-to-br from-primary to-purple-600 text-white'
                }`}>
                  {isAiEnabled ? (
                    <div className="space-y-2">
                      <p>✨ Personalized AI Reply...</p>
                      <p className="text-[10px] opacity-40 font-bold uppercase">Mode: {brandTone}</p>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {replyMessage || "Drop your message template here..."}
                    </div>
                  )}
                  {/* Subtle Shimmer for AI */}
                  {isAiEnabled && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                Secure Pipeline Connected
              </div>
              <p className="text-[10px] text-white/30 text-center font-medium leading-relaxed">
                Automations are processed via our distributed worker queue to stay within Instagram's security limits.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
