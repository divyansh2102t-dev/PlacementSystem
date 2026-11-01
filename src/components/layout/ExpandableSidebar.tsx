"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Layers,
  TrendingUp,
  Database,
  UserCheck,
  CircleHelp,
  Sparkles,
} from "lucide-react";
import { UserRole } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface ExpandableSidebarProps {
  role: UserRole;
  onOpenHelp?: () => void;
}

export function ExpandableSidebar({ role, onOpenHelp }: ExpandableSidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isExpanded = isHovered || isFocused;

  const adminNavItems: NavItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Companies", href: "/admin/companies", icon: Building2 },
    { label: "Applications", href: "/admin/applications", icon: Layers },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { label: "DBMS Explorer", href: "/admin/dbms-explorer", icon: Database },
  ];

  const studentNavItems: NavItem[] = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Companies", href: "/student/companies", icon: Building2 },
    { label: "Applications", href: "/student/applications", icon: Layers },
    { label: "Analytics", href: "/student/analytics", icon: TrendingUp },
    { label: "My Profile", href: "/student/profile", icon: UserCheck },
  ];

  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  return (
    <>
      {/* DESKTOP SIDEBAR: Slim (64px) -> Smooth Expand (240px) on Hover / Focus */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsFocused(true)}
        onBlurCapture={(e) => {
          // If focus leaves the sidebar entirely, collapse it
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsFocused(false);
          }
        }}
        aria-label={`${role === "admin" ? "Admin" : "Student"} Navigation`}
        className={`hidden sm:flex relative z-40 shrink-0 flex-col rounded-2xl py-3.5 px-2 transition-all duration-200 ease-out select-none shadow-xs border border-slate-200/60 dark:border-slate-800 ${
          isExpanded
            ? "w-[240px] bg-[#fbfcf5] dark:bg-slate-900 shadow-xl"
            : "w-[64px] bg-[#fbfcf5] dark:bg-slate-900/90"
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-1.5 pb-2">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#252a27] text-sm font-black text-emerald-300 shadow"
            title="PlaceHub Home"
          >
            P
          </div>
          {isExpanded && (
            <div className="overflow-hidden transition-all duration-200 animate-in fade-in">
              <h2 className="text-xs font-bold leading-none tracking-tight text-slate-900 dark:text-white">
                PlaceHub
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {role === "admin" ? "Admin Desk" : "Student Portal"}
              </span>
            </div>
          )}
        </div>

        <div className="my-2 h-[1px] w-full bg-slate-200/70 dark:bg-slate-800" />

        {/* Nav Items */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map(({ label, href, icon: Icon, badge }) => {
            const isActive =
              pathname === href || (href !== `/${role}/dashboard` && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                title={!isExpanded ? label : undefined}
                className={`group relative flex items-center gap-3 rounded-xl py-2 px-2.5 transition-all text-xs font-semibold ${
                  isActive
                    ? "bg-[#252a27] text-emerald-300 shadow-sm dark:bg-emerald-700 dark:text-white"
                    : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center">
                  <Icon size={17} />
                </span>

                {/* Expanded Label */}
                {isExpanded ? (
                  <span className="truncate transition-all duration-150 animate-in fade-in">
                    {label}
                  </span>
                ) : (
                  /* Tooltip on collapsed state for hover / focus */
                  <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg group-hover:block group-focus:block animate-in fade-in">
                    {label}
                  </span>
                )}

                {badge && isExpanded && (
                  <span className="ml-auto rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Help & Status */}
        <div className="mt-auto flex flex-col gap-1 pt-2 border-t border-slate-200/70 dark:border-slate-800">
          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              title={!isExpanded ? "Help & Documentation" : undefined}
              className="flex items-center gap-3 rounded-xl p-2 text-xs font-medium text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition"
            >
              <CircleHelp size={17} className="shrink-0" />
              {isExpanded && <span className="truncate">Help & Docs</span>}
            </button>
          )}

          {isExpanded && (
            <div className="mt-1 rounded-xl bg-emerald-50/70 p-2 text-[10px] text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              <p className="flex items-center gap-1 font-bold">
                <Sparkles size={11} /> 2026–2027 Drives
              </p>
              <p className="opacity-80 text-[9px]">Placement DB Active</p>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:hidden shadow-lg"
      >
        {navItems.slice(0, 5).map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== `/${role}/dashboard` && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-[10px] font-semibold transition ${
                isActive
                  ? "text-emerald-700 dark:text-emerald-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
