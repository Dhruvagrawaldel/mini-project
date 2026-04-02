"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageCircle, 
  LayoutDashboard, 
  Zap, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Instagram,
  Sparkles,
  CreditCard
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import InstagramConnectModal from "@/components/InstagramConnectModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Builder", href: "/dashboard/builder", icon: Zap },
    { name: "Instagram", href: "/dashboard/instagram", icon: Instagram },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "AI Ads", href: "/dashboard/ai-ads", icon: Sparkles, badge: true },
    { name: "Pricing", href: "/dashboard/pricing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "??";

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary/20 p-1.5 rounded-md">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold tracking-tight">AutoDM</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 border border-border rounded-md bg-background"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className={`
        ${isMobileMenuOpen ? 'flex' : 'hidden'} 
        md:flex flex-col w-full md:w-64 border-r border-border bg-card/30 backdrop-blur-xl h-screen sticky top-0 z-40
      `}>
        <div className="p-6 hidden md:block">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-lg">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">AutoDM</span>
          </Link>
        </div>
        
        <div className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          <div className="text-xs font-medium text-muted-foreground px-4 mb-2 uppercase tracking-wider">
            Menu
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : link.badge
                    ? "text-violet-300 hover:text-violet-200 hover:bg-violet-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : link.badge ? "text-violet-400" : ""}`} />
                <span className="flex-1">{link.name}</span>
                {link.badge && !isActive && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">New</span>
                )}
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {userInitials}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{session?.user?.name || "Loading..."}</div>
              <div className="text-xs text-muted-foreground truncate">{session?.user?.email}</div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-muted-foreground hover:text-destructive transition-colors p-2"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-65px)] md:min-h-screen relative">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none z-[-1]" />
        {children}
      </main>

      {/* Instagram connection prompt (shown once per session if not connected) */}
      <InstagramConnectModal />
    </div>
  );
}
