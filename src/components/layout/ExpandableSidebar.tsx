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
  UserCheck,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
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

export function ExpandableSidebar({ role }: ExpandableSidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isExpanded = isHovered || isFocused;

  const adminNavItems: NavItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Companies & Drives", href: "/admin/companies", icon: Building2 },
    { label: "Applications & Stages", href: "/admin/applications", icon: Layers },
    { label: "Students & Users", href: "/admin/students", icon: Users },
    { label: "Placement Analytics", href: "/admin/analytics", icon: TrendingUp },
  ];

  const studentNavItems: NavItem[] = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Browse Companies", href: "/student/companies", icon: Building2 },
    { label: "My Applications", href: "/student/applications", icon: Layers },
    { label: "My Analytics", href: "/student/analytics", icon: TrendingUp },
    { label: "Profile & Resume", href: "/student/profile", icon: UserCheck },
  ];

  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsFocused(false);
          }
        }}
        aria-label={`${role === "admin" ? "Admin" : "Student"} Navigation`}
        className={`hidden sm:flex relative z-40 shrink-0 flex-col rounded-2xl py-3.5 px-2 transition-all duration-200 ease-out select-none shadow-xs border border-slate-200 bg-white ${
          isExpanded
            ? "w-[240px] shadow-lg"
            : "w-[68px]"
        }`}
      >
        {/* Clickable Brand Logo linking to Homepage */}
        <Link
          href="/"
          title="Return to Home"
          className="flex items-center gap-3 px-1.5 pb-2 group"
        >
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-base font-black text-white shadow-sm group-hover:bg-emerald-700 transition"
          >
            P
          </div>
          {isExpanded && (
            <div className="overflow-hidden transition-all duration-200">
              <h2 className="text-sm font-bold leading-none tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                PlaceHub
              </h2>
              <span className="text-[10px] font-semibold text-emerald-700">
                {role === "admin" ? "Admin Portal" : "Student Portal"}
              </span>
            </div>
          )}
        </Link>

        {/* Back to Homepage Button in Sidebar */}
        <div className="pt-1 pb-2">
          <Link
            href="/"
            title="Back to Homepage"
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition border border-transparent hover:border-emerald-200"
          >
            <ArrowLeft size={16} className="shrink-0 text-slate-400 group-hover:text-emerald-700" />
            {isExpanded && <span className="truncate">Back to Home</span>}
          </Link>
        </div>

        <div className="my-1.5 h-[1px] w-full bg-slate-100" />

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 flex-1">
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
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center">
                  <Icon size={17} />
                </span>

                {/* Expanded Label */}
                {isExpanded ? (
                  <span className="truncate transition-all duration-150">
                    {label}
                  </span>
                ) : (
                  <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg group-hover:block group-focus:block">
                    {label}
                  </span>
                )}

                {badge && isExpanded && (
                  <span className="ml-auto rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Role Badge Indicator */}
        <div className="mt-auto flex flex-col gap-1 pt-2 border-t border-slate-100">
          <div className="rounded-xl bg-slate-50 p-2 text-[11px] text-slate-600 flex items-center gap-2">
            {role === "admin" ? (
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <GraduationCap size={16} className="text-emerald-600 shrink-0" />
            )}
            {isExpanded && (
              <div className="truncate">
                <p className="font-bold text-slate-800 text-[10px] uppercase">
                  {role === "admin" ? "Admin Access" : "Student Access"}
                </p>
                <p className="text-[10px] text-slate-400">Authenticated</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-md sm:hidden shadow-lg"
      >
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-[10px] font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          <span>Home</span>
        </Link>
        {navItems.slice(0, 4).map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== `/${role}/dashboard` && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-[10px] font-semibold transition ${
                isActive
                  ? "text-emerald-700 font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
