"use client";

import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      setError("An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex text-foreground">
      {/* Left panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 md:p-16 xl:p-24 relative z-10 bg-background/50 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 w-fit mb-12">
          <div className="bg-primary/20 p-2 rounded-lg">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">AutoDM</span>
        </Link>
        
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8 text-sm">Log in to your account to continue managing your automations.</p>
          
          <button 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-border bg-card/50 hover:bg-accent/50 text-foreground px-4 py-3 rounded-xl font-medium transition-colors mb-6"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 text-center">
              {error}
            </div>
          )}
          
          <form className="flex flex-col gap-4" onSubmit={handleCredentialsLogin}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                className="bg-card w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-card w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
      
      {/* Right panel - Image/Gradient */}
      <div className="hidden lg:flex w-1/2 bg-secondary relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
        <div className="absolute w-full h-[150%] max-w-[800px] left-1/2 -translate-x-1/2 bg-gradient-to-tr from-primary/40 to-blue-600/40 blur-[100px] opacity-50 rounded-full" />
        <div className="absolute w-[80%] aspect-square max-w-[500px] bg-black/40 rounded-3xl backdrop-blur-3xl border border-white/10 shadow-2xl p-8 flex flex-col z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs bg-white/10 rounded-full px-3 py-1 text-white/70">Instagram Connection</div>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col gap-4 opacity-80 pointer-events-none select-none">
            <div className="bg-white/5 rounded-2xl p-4 flex gap-4 animate-pulse duration-[3s]">
              <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            </div>
            <div className="bg-primary/20 border border-primary/30 rounded-2xl p-4 flex gap-4 self-end w-4/5 animate-pulse duration-[3s] delay-700">
              <div className="flex flex-col gap-2 w-full items-end">
                <div className="h-4 bg-primary/40 rounded w-1/4" />
                <div className="h-3 bg-primary/20 rounded w-3/4" />
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 flex gap-4 animate-pulse duration-[3s] delay-1000">
              <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-white/10 rounded w-2/5" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-white/60 text-sm font-medium">
            Join the automation revolution
          </div>
        </div>
      </div>
    </div>
  );
}
