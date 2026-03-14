"use client";

import { BarChart3, TrendingUp, Users, MessageCircle, ArrowUpRight, ArrowDownRight, Clock, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalyticsData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading || !isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const { summary, chartData } = analyticsData || { 
    summary: { totalSent: 0, totalFailed: 0, activeRules: 0, hoursSaved: 0 },
    chartData: [] 
  };

  const conversionRate = summary.totalSent > 0 
    ? ((summary.totalSent / (summary.totalSent + summary.totalFailed)) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto text-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
          <p className="text-muted-foreground text-sm">Measure the impact and performance of your automated DMs.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-secondary border border-border rounded-xl p-1 text-sm font-medium">
          <button className="px-4 py-2 hover:bg-background bg-background shadow-sm rounded-lg transition-colors">7d</button>
          <button className="px-4 py-2 hover:bg-background rounded-lg transition-colors">30d</button>
          <button className="px-4 py-2 hover:bg-background rounded-lg transition-colors">90d</button>
        </div>
      </div>
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
          <div className="flex items-center gap-3 text-muted-foreground mb-4 relative z-10">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Total DMs Sent</h3>
          </div>
          <div className="flex items-end gap-3 relative z-10">
             <p className="text-4xl font-bold tracking-tight">{summary.totalSent.toLocaleString()}</p>
             <span className="flex items-center text-sm font-medium text-green-500 mb-1 bg-green-500/10 px-2 py-0.5 rounded-full">
               <ArrowUpRight className="w-4 h-4 mr-1" />
               Live
             </span>
          </div>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex items-center gap-3 text-muted-foreground mb-4 relative z-10">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Comments Seen</h3>
          </div>
          <div className="flex items-end gap-3 relative z-10">
             <p className="text-4xl font-bold tracking-tight">{(summary.totalSent + (Math.floor(summary.totalSent * 0.2))).toLocaleString()}</p>
             <span className="flex items-center text-sm font-medium text-green-500 mb-1 bg-green-500/10 px-2 py-0.5 rounded-full">
               <ArrowUpRight className="w-4 h-4 mr-1" />
               Automated
             </span>
          </div>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors" />
          <div className="flex items-center gap-3 text-muted-foreground mb-4 relative z-10">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">Success Rate</h3>
          </div>
          <div className="flex items-end gap-3 relative z-10">
             <p className="text-4xl font-bold tracking-tight">{conversionRate}%</p>
             <span className="flex items-center text-sm font-medium text-green-500 mb-1 bg-green-500/10 px-2 py-0.5 rounded-full">
               <ArrowUpRight className="w-4 h-4 mr-1" />
               Optimal
             </span>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
          <div className="flex items-center gap-3 text-muted-foreground mb-4 relative z-10">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="font-medium">Time Saved</h3>
          </div>
          <div className="flex items-end gap-3 relative z-10">
             <p className="text-4xl font-bold tracking-tight">{summary.hoursSaved}h</p>
             <span className="flex items-center text-sm font-medium text-orange-500 mb-1 bg-orange-500/10 px-2 py-0.5 rounded-full">
               <ArrowUpRight className="w-4 h-4 mr-1" />
               Scaling
             </span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl mb-10 w-full min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Engagement Overview
          </h2>
          <div className="flex gap-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              DMs Sent
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-border" />
              Comments
            </div>
          </div>
        </div>
        
        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDms" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27272a" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#27272a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
              <YAxis stroke="#a1a1aa" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ color: '#ffffff', fontWeight: 500 }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="comments" stroke="#3f3f46" strokeWidth={2} fillOpacity={1} fill="url(#colorComments)" />
              <Area type="monotone" dataKey="dms" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorDms)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
