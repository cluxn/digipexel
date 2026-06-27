"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Globe,
  LogOut,
  Loader2,
  Users,
  Megaphone,
  Search,
  Settings,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

// Top-level sidebar groups. "match" paths determine when the item is "active".
const NAV = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    match: ["/admin"],
  },
  {
    label: "Content",
    icon: FileText,
    href: "/admin/blog",
    match: ["/admin/blog", "/admin/case-studies", "/admin/guides",
            "/admin/testimonials", "/admin/logos", "/admin/categories"],
  },
  {
    label: "Leads",
    icon: Users,
    href: "/admin/leads",
    match: ["/admin/leads", "/admin/newsletter"],
  },
  {
    label: "Marketing",
    icon: Megaphone,
    href: "/admin/nudges",
    match: ["/admin/nudges", "/admin/banners"],
  },
  {
    label: "SEO",
    icon: Search,
    href: "/admin/seo",
    match: ["/admin/seo"],
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    match: ["/admin/settings", "/admin/users", "/admin/analytics"],
  },
];

const FONT = "'Segoe UI', Arial, system-ui, sans-serif";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    if (localStorage.getItem("admin_sidebar_collapsed") === "true") setCollapsed(true);
  }, [router]);

  React.useEffect(() => {
    const handler = (e: PromiseRejectionEvent) => {
      const stack = (e.reason as Error)?.stack ?? "";
      if (stack.includes("chrome-extension://")) e.preventDefault();
    };
    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(prev => {
      localStorage.setItem("admin_sidebar_collapsed", String(!prev));
      return !prev;
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4" style={{ fontFamily: FONT }}>
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-slate-400 font-semibold tracking-widest text-[10px] uppercase">Authenticating...</p>
      </div>
    );
  }

  const sidebarW = collapsed ? "w-[64px]" : "w-56";
  const mainML   = collapsed ? "ml-[64px]" : "ml-56";

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]" style={{ fontFamily: FONT }}>

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-200",
        sidebarW
      )}>

        {/* Logo row */}
        <div className={cn(
          "flex items-center h-14 border-b border-slate-100 flex-shrink-0 gap-2",
          collapsed ? "justify-center px-0" : "px-4 justify-between"
        )}>
          {!collapsed && (
            <span className="text-[13px] font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-md bg-brand text-white flex items-center justify-center text-[10px] font-black">D</span>
              Digi Pexel
            </span>
          )}
          <button
            onClick={toggleSidebar}
            title={collapsed ? "Expand" : "Collapse"}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            {collapsed
              ? <PanelLeftOpen  className="w-4 h-4" />
              : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden space-y-0.5 px-2">
          {NAV.map(item => {
            const isActive = item.match.some(m =>
              m === "/admin" ? pathname === m : pathname.startsWith(m)
            );
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg transition-colors duration-150",
                  collapsed ? "justify-center py-3 px-0" : "px-3 py-2.5",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive ? "text-blue-600" : "")} />
                {!collapsed && (
                  <span className="text-[13px] truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 py-3 px-2 space-y-0.5">
          <Link
            href="/"
            title={collapsed ? "View Site" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors font-medium",
              collapsed ? "justify-center py-3 px-0" : "px-3 py-2.5"
            )}
          >
            <Globe className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="text-[13px]">View Site</span>}
          </Link>
          <button
            onClick={handleSignOut}
            title={collapsed ? "Sign Out" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors w-full font-medium",
              collapsed ? "justify-center py-3 px-0" : "px-3 py-2.5"
            )}
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="text-[13px]">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={cn("flex-1 p-8 transition-all duration-200 min-w-0", mainML)}>
        {children}
      </main>
    </div>
  );
}
