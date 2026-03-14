"use client";

import { MessageSquareText, Zap, Link as LinkIcon, Instagram, ChevronRight, Save, Play, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AutomationBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [name, setName] = useState("Course Link AutoDM");
  const [triggerType, setTriggerType] = useState("comment");
  const [keywords, setKeywords] = useState("course, link");
  const [replyMessage, setReplyMessage] = useState("Hey there! Here is the link you requested: https://example.com/course");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchAutomation() {
      if (editId) {
        try {
          const res = await fetch(`/api/automations/${editId}`);
          if (res.ok) {
            const data = await res.json();
            setName(data.name);
            setKeywords(Array.isArray(data.keywords) ? data.keywords.join(", ") : data.keywords);
            setReplyMessage(data.response_message);
            setTriggerType(data.trigger_type || "comment");
          }
        } catch (err) {
          console.error("Error fetching automation:", err);
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
          response_message: replyMessage,
          trigger_type: triggerType,
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

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto text-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Automations</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{editId ? 'Edit' : 'Create New'}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{editId ? 'Edit' : 'Automation Builder'}</h1>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <Link href="/dashboard" className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-border bg-card hover:bg-accent text-foreground px-4 py-2.5 rounded-xl font-medium transition-colors">
            Cancel
          </Link>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editId ? 'Apply Changes' : 'Save & Enable'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* General */}
          <section className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              1. General Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Automation Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Masterclass Link" 
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Trigger */}
          <section className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-blue-500" />
              2. Trigger Keyword
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setTriggerType('comment')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${triggerType === 'comment' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-muted-foreground text-muted-foreground'}`}
                >
                  <MessageSquareText className="w-6 h-6" />
                  <span className="font-medium">Post Comment</span>
                </button>
                <button 
                  disabled
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all opacity-50 cursor-not-allowed border-border text-muted-foreground`}
                >
                  <Instagram className="w-6 h-6" />
                  <span className="font-medium">Direct Message</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full mt-1">Coming Soon</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Keywords (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="link, course, info" 
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">The automation will trigger when a user comments exactly one of these words.</p>
              </div>
            </div>
          </section>

          {/* Action */}
          <section className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-purple-500" />
              3. Response Message
            </h2>
            
            <div className="space-y-4">
              <textarea 
                rows={5}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none font-medium"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
          </section>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-card/50 backdrop-blur-md border border-border rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
            
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 relative z-10">
              <Play className="w-4 h-4 text-primary" />
              Live Preview
            </h3>
            
            <div className="space-y-6 relative z-10">
              {/* Comment Bubble */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-secondary shrink-0 overflow-hidden" />
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <span className="text-xs font-semibold text-muted-foreground">instagram_user</span>
                  <div className="bg-secondary/50 text-foreground px-4 py-2 rounded-2xl rounded-tl-sm text-sm border border-border">
                    Hey! Could you send me the <strong className="text-primary font-bold">link</strong>?
                  </div>
                </div>
              </div>

              {/* DM Bubble */}
              <div className="flex gap-3 items-start flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 overflow-hidden flex items-center justify-center text-primary font-bold text-xs ring-2 ring-primary/30">
                  AD
                </div>
                <div className="flex flex-col gap-1 items-end max-w-[85%]">
                  <span className="text-xs font-semibold text-muted-foreground">AutoDM</span>
                  <div className="bg-gradient-to-br from-primary to-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm shadow-lg whitespace-pre-wrap">
                    {replyMessage || "Type your message on the left..."}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-border/50 text-center relative z-10">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Instagram className="w-3 h-3" />
                Message will be sent instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
