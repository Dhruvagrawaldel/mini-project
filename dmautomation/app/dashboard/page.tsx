"use client";

import Link from "next/link";
import { Plus, MessageSquare, Clock, Zap, MoreVertical, Play, Pause, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AutomationData {
  id: string;
  name: string;
  keywords: string[];
  response_message: string;
  is_active: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const [automations, setAutomations] = useState<AutomationData[]>([]);
  const [stats, setStats] = useState({ activeRules: 0, totalSent: 0, hoursSaved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [autoRes, statsRes] = await Promise.all([
          fetch("/api/automations"),
          fetch("/api/analytics")
        ]);

        if (autoRes.ok) {
          const data = await autoRes.json();
          setAutomations(data);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.summary);
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
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto text-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Automations</h1>
          <p className="text-muted-foreground text-sm">Manage your Instagram DM automations and see how they're performing.</p>
        </div>
        
        <Link href="/dashboard/builder" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shrink-0 shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          Create New
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Active Rules</h3>
          </div>
          <p className="text-4xl font-bold tracking-tight">{stats.activeRules}</p>
          <div className="text-xs text-primary mt-2">Currently running</div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Total DMs Sent</h3>
          </div>
          <p className="text-4xl font-bold tracking-tight">{stats.totalSent.toLocaleString()}</p>
          <div className="text-xs text-green-500 mt-2">Historical volume</div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="font-medium">Hours Saved</h3>
          </div>
          <p className="text-4xl font-bold tracking-tight">{stats.hoursSaved}</p>
          <div className="text-xs text-muted-foreground mt-2">Estimated scaling impact</div>
        </div>
      </div>
      
      {/* Automations List */}
      <div className="bg-card/50 border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Automations</h2>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground">View all</button>
        </div>
        
        <div className="divide-y divide-border">
          {automations.map((auto) => (
            <div key={auto.id} className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-start gap-4 flex-1">
                <button 
                  onClick={() => toggleStatus(auto.id, auto.is_active)}
                  className={`p-3 rounded-xl flex items-center justify-center shrink-0 transition-all ${auto.is_active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                  {auto.is_active ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                </button>
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    {auto.name}
                    {auto.is_active && (
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </h3>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-2">
                    <span className="flex items-center gap-1"><span className="font-medium text-foreground">Trigger:</span> {auto.keywords.join(", ")}</span>
                    <span className="flex items-center gap-1"><span className="font-medium text-foreground">Created:</span> {new Date(auto.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2 md:mt-0 self-end md:self-auto">
                <Link href={`/dashboard/builder?id=${auto.id}`} className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/40 transition-colors">
                  Edit
                </Link>
                <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {automations.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No automations yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Create your first keyword trigger to start automating your DMs.</p>
            <Link href="/dashboard/builder" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
              Create Automation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
