"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Globe,
  LogOut,
  Sparkles,
  Loader2,
  BookOpen,
  FileText,
  Briefcase,
  Mail,
  Layers,
  Settings,
  BarChart2,
  UserCog,
  Search,
  Tag,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const sidebarItems = [
  { name: "DASHBOARD",     icon: LayoutDashboard, href: "/admin"              },
  { name: "SITE CONTENT",  icon: Globe,            href: "/admin/site-content" },
  { name: "PARTNER LOGOS", icon: ImageIcon,        href: "/admin/logos"        },
  { name: "CASE STUDIES",  icon: Briefcase,        href: "/admin/case-studies" },
  { name: "BLOG POSTS",    icon: FileText,          href: "/admin/blog"         },
  { name: "GUIDES",        icon: BookOpen,          href: "/admin/guides"       },
  { name: "CATEGORIES",    icon: Tag,               href: "/admin/categories"   },
  { name: "TESTIMONIALS",  icon: MessageSquare,     href: "/admin/testimonials" },
  { name: "LEADS",         icon: Users,             href: "/admin/leads"        },
  { name: "NEWSLETTER",    icon: Mail,              href: "/admin/newsletter"   },
  { name: "POPUPS",        icon: Sparkles,          href: "/admin/nudges"       },
  { name: "BANNERS",       icon: Layers,            href: "/admin/banners"      },
  { name: "ANALYTICS",     icon: BarChart2,         href: "/admin/analytics"    },
  { name: "SEO",           icon: Search,            href: "/admin/seo"          },
  { name: "USERS",         icon: UserCog,           href: "/admin/users"        },
  { name: "SETTINGS",      icon: Settings,          href: "/admin/settings"     },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">Authenticating...</p>
      </div>
    );
  }

  const sidebarW = collapsed ? "w-[68px]" : "w-64";
  const mainML  = collapsed ? "ml-[68px]" : "ml-64";

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-brand/10 selection:text-brand">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 overflow-hidden transition-all duration-200 shadow-sm",
        sidebarW
      )}>
        {/* Logo + collapse toggle */}
        <div className={cn(
          "flex items-center border-b border-slate-100 h-16 flex-shrink-0",
          collapsed ? "justify-center px-0" : "justify-between px-5"
        )}>
          {!collapsed && (
            <div>
              <span className="text-sm font-display font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Digi Pexel <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              </span>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-0.5">Admin</p>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all flex-shrink-0"
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 mx-2 my-0.5 rounded-lg transition-all duration-150 group",
                  collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
                  isActive
                    ? "bg-brand/8 text-brand"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive ? "text-brand" : "text-inherit")} />
                {!collapsed && (
                  <span className="text-[11px] font-bold tracking-[0.12em] truncate">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          "py-3 mt-auto border-t border-slate-100",
          collapsed ? "px-0" : "px-2"
        )}>
          <Link
            href="/"
            title={collapsed ? "View Site" : undefined}
            className={cn(
              "flex items-center gap-3 mx-0 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all",
              collapsed ? "justify-center mx-2 py-3 px-0" : "px-3 py-2.5 mx-0"
            )}
          >
            <Globe className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="text-[11px] font-bold tracking-[0.12em]">VIEW SITE</span>}
          </Link>
          <button
            onClick={handleSignOut}
            title={collapsed ? "Sign Out" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all w-full",
              collapsed ? "justify-center mx-2 py-3 px-0" : "px-3 py-2.5 mx-0"
            )}
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="text-[11px] font-bold tracking-[0.12em]">SIGN OUT</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("flex-1 p-10 transition-all duration-200", mainML)}>
        {children}
      </main>
    </div>
  );
}
