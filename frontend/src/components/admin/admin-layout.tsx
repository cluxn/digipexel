"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Workflow, 
  MessageSquare, 
  Users, 
  Globe, 
  LogOut,
  Sparkles,
  Loader2,
  BookOpen,
  FileText,
  Briefcase
} from "lucide-react";

const sidebarItems = [
  { name: "DASHBOARD", icon: LayoutDashboard, href: "/admin", status: "Active" },
  { name: "LOGO MARQUEE", icon: ImageIcon, href: "/admin/logos", status: "Active" },
  { name: "VISUAL PROCESS", icon: Workflow, href: "#", status: "Upcoming" },
  { name: "INSIGHTS & GUIDES", icon: BookOpen, href: "/admin/guides", status: "Active" },
  { name: "BLOG HUB", icon: FileText, href: "/admin/blog", status: "Active" },
  { name: "CASE VAULT", icon: Briefcase, href: "/admin/case-studies", status: "Active" },
  { name: "TESTIMONIALS", icon: MessageSquare, href: "/admin/testimonials", status: "Active" },
  { name: "CONTACT LEADS", icon: Users, href: "/admin/leads", status: "Active" },
  { name: "NUDGES", icon: Sparkles, href: "/admin/nudges", status: "Active" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Check auth
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-brand/10 selection:text-brand">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1A1C1E] text-white flex flex-col fixed inset-y-0 left-0 z-50 overflow-hidden shadow-2xl">
        {/* Logo Section */}
        <div className="p-8 mb-8 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-display font-bold tracking-tight text-white flex items-center gap-2">
              Digi Pexel <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Admin Station</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-brand/10 text-brand border border-brand/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-brand" : "text-inherit")} />
                <span className="text-[11px] font-bold tracking-[0.15em]">
                  {item.name}
                </span>
                {item.status === "Upcoming" && (
                  <span className="ml-auto text-[8px] bg-white/5 px-1.5 py-0.5 rounded opacity-50">SOON</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-6 space-y-2 mt-auto border-t border-white/5 bg-black/20">
          <Link 
            href="/" 
            className="flex items-center gap-4 px-6 py-4 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all w-full"
          >
            <Globe className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-[0.15em]">VIEW SITE</span>
          </Link>
          <button 
            className="flex items-center gap-4 px-6 py-4 rounded-xl text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all w-full text-left"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-[0.15em]">SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        {children}
      </main>
    </div>
  );
}
