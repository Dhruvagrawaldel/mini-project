"use client";

import { useState, useEffect } from "react";
import { User, Settings, Shield, Bell, Instagram, Save, Loader2, CheckCircle2, Zap } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [igToken, setIgToken] = useState("");
  const [igAccountId, setIgAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      
      const fetchUserData = async () => {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            setIgToken(data.ig_access_token || "");
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
    setIsLoading(true);
    setIsSaved(false);
    
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ig_access_token: igToken, ig_account_id: igAccountId }),
      });

      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        update({ name });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/auth/instagram/refresh", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        alert(data.message || "Refresh failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto text-foreground">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account preferences and Instagram integration.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none cursor-not-allowed opacity-70"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-pink-500/10 p-2 rounded-lg">
                <Instagram className="w-5 h-5 text-pink-500" />
              </div>
              <h2 className="text-xl font-semibold">Instagram Connection</h2>
            </div>
            {igAccountId && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefreshToken}
                  disabled={isRefreshing}
                  className="text-xs font-medium text-primary hover:underline flex items-center gap-1.5 mr-2"
                >
                  {isRefreshing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                  Refresh Token
                </button>
                <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </span>
              </div>
            )}
          </div>
          <div className="p-6 space-y-6">
            <div className="p-4 bg-secondary/50 rounded-xl border border-border flex items-start gap-4">
              <div className="mt-0.5">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-sm">
                <p className="font-medium mb-1 text-foreground">How to get your credentials?</p>
                <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                  Go to your Meta Developers console, create an App, and configure Instagram Basic Display or Graph API. 
                  Provide the Long-Lived Access Token and your Instagram Business Account ID below.
                </p>
                <a href="https://developers.facebook.com/" target="_blank" className="text-primary hover:underline text-xs flex items-center gap-1 font-medium">
                  Meta Developers Console
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Instagram Business Account ID</label>
                <input 
                  type="text" 
                  value={igAccountId}
                  onChange={(e) => setIgAccountId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-sm"
                  placeholder="e.g. 17841401234567890"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Long-lived Access Token</label>
                <div className="relative">
                   <input 
                    type="password" 
                    value={igToken}
                    onChange={(e) => setIgToken(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-sm pr-10"
                    placeholder="IGQV..."
                  />
                </div>
                <p className="text-xs text-muted-foreground">Tokens are valid for 60 days. Refresh them every 24 hours to keep automation running.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-4 pt-4">
          {isSaved && (
            <span className="text-sm text-green-500 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved!
            </span>
          )}
          <button 
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
