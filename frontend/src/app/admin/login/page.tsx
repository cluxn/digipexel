"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, KeyRound, Eye, EyeOff } from "lucide-react";
import { cn, safeFetch } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

export default function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Primary: email + password via auth.php (users table)
      const res = await safeFetch(`${API_BASE_URL}/auth.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res?.status === "success") {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
        return;
      }

      // Fallback: auth.php not yet deployed — check settings passcode
      // (email is still validated below to prevent blank-email bypass)
      if (!email.includes("@")) {
        setError("Invalid email or password");
        return;
      }
      const fb = await safeFetch(`${API_BASE_URL}/settings.php?key=admin_passcode`);
      const stored = fb?.status === "success"
        ? String((fb.data as Record<string, unknown>)?.value ?? "")
        : "";
      if (stored && password === stored) {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
      } else {
        setError(String(res?.message ?? "Invalid email or password"));
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-brand/10 border border-brand/20 shadow-xl shadow-brand/5 mb-2">
            <KeyRound className="text-brand w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-[#1A1C1E] tracking-tight">Admin Access</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Enter your credentials to continue</p>
          </div>
        </div>

        {/* Card */}
        <div className={cn(
          "bg-white rounded-[2.5rem] p-10 border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] transition-all duration-300",
          error ? "border-rose-200 ring-4 ring-rose-50" : "border-slate-100"
        )}>
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-widest uppercase text-slate-500 pl-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@digipexel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm text-[#1A1C1E] placeholder-slate-300 focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-widest uppercase text-slate-500 pl-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 pr-12 text-sm text-[#1A1C1E] placeholder-slate-300 focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold pl-1 animate-in slide-in-from-top-2">
                <ShieldAlert className="w-3 h-3 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#1A1C1E] hover:bg-black text-white h-14 rounded-2xl font-bold text-base shadow-xl shadow-black/10 transition-all active:scale-[0.98] mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Signing in…</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-slate-400 hover:text-brand text-xs font-bold tracking-widest uppercase transition-colors">
            Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
