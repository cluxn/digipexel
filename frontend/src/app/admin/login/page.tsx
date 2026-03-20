"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowRight, Lock, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Artificial delay for premium feel
    setTimeout(() => {
      if (code === "12345") {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
      } else {
        setError(true);
        setLoading(false);
        // Reset code on error
        setCode("");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-brand/10 border border-brand/20 shadow-xl shadow-brand/5 mb-2 group">
             <KeyRound className="text-brand w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="space-y-1">
             <h1 className="text-4xl font-display font-bold text-[#1A1C1E] tracking-tight">Admin Access</h1>
             <p className="text-slate-400 text-sm font-medium">Please enter your private security code.</p>
          </div>
        </div>

        {/* Login Card */}
        <div className={cn(
          "bg-white rounded-[2.5rem] p-10 border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-300",
          error ? "border-rose-200 ring-4 ring-rose-50" : "border-slate-100"
        )}>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-brand transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="•••••"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-16 bg-slate-50/50 border border-slate-100 rounded-3xl pl-12 pr-6 text-2xl tracking-[1em] focus:outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-[#1A1C1E] font-bold text-center"
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-rose-500 text-xs font-bold pl-1 animate-in slide-in-from-top-2">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Invalid security code. Please try again.</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || code.length === 0}
              className="w-full bg-[#1A1C1E] hover:bg-black text-white h-16 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Verify & Unlock <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Return Link */}
        <div className="text-center">
            <Link href="/" className="text-slate-400 hover:text-brand text-xs font-bold tracking-widest uppercase transition-colors">
               Return to Website
            </Link>
        </div>
      </div>
    </div>
  );
}

// Simple Link mock as next/link might need to be imported
import Link from "next/link";
