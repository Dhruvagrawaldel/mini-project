import { motion } from "framer-motion";
import { MessageCircle, Zap, Shield, ArrowRight, Instagram, BarChart3, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid z-[-1] opacity-50 pointer-events-none" />

      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-lg">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">AutoDM</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-32 max-w-7xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">Meta Approved Partner API</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl">
          Automate your <span className="text-gradient">Instagram DMs</span> on autopilot
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
          Turn your Instagram comments into sales. Instantly send DMs, links, and resources to anyone who comments a specific keyword on your posts.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/signup" 
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]"
          >
            Start Automating Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="#demo" 
            className="flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium border border-border hover:bg-accent/50 transition-colors"
          >
            Watch Demo
          </Link>
        </div>
        
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Trust badges could go here */}
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-card/30 backdrop-blur-lg border-y border-border relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Stop leaving money on the table. Respond to every lead instantly.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Responses</h3>
              <p className="text-muted-foreground">Deliver links, lead magnets, and answers within seconds of a user leaving a comment.</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
              <p className="text-muted-foreground">Track comments detected, DMs sent, and conversion rates directly from your dashboard.</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Safe & Compliant</h3>
              <p className="text-muted-foreground">Built on the official Instagram Graph API. No shadowbans or sketchy workarounds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Set up your first automation in under 3 minutes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />
            
            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-background flex items-center justify-center text-2xl font-bold z-10 mb-6 shadow-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Account</h3>
              <p className="text-muted-foreground">Link your Instagram Professional account securely using Meta OAuth.</p>
            </div>
            
            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-background flex items-center justify-center text-2xl font-bold z-10 mb-6 shadow-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Set Keywords</h3>
              <p className="text-muted-foreground">Define trigger words like "course" or "link" for specific posts.</p>
            </div>
            
            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-background flex items-center justify-center text-2xl font-bold z-10 mb-6 shadow-xl text-primary">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Auto DM</h3>
              <p className="text-muted-foreground">Watch as AutoDM instantly sends your tailored message to commenters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-primary/20 to-transparent border border-primary/20 p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Stop leaving leads waiting.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 relative z-10">
            Join modern creators and brands automating their engagement.
          </p>
          <div className="flex justify-center relative z-10">
            <Link 
              href="/signup" 
              className="bg-foreground text-background px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              Start for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 text-center text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground tracking-tight">AutoDM</span>
            <span className="text-sm">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
