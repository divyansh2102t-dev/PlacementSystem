"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getClientUser, clearClientUser, AUTH_CHANGE_EVENT } from "@/lib/auth";
import { User } from "@/types";
import { Logo } from "@/components/ui/Logo";
import {
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export function PublicNavbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const user = getClientUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };

    syncAuth();
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    clearClientUser();
    setCurrentUser(null);
    window.location.href = "/";
  };

  const dashboardHref =
    currentUser?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Recruitment Drives", href: "/drives" },
    { label: "Hiring Pipeline", href: "/pipeline" },
    { label: "Placement Stats", href: "/statistics" },
    { label: "Partner Companies", href: "/companies" },
    { label: "About & Policies", href: "/about" },
  ];

  return (
    <header className="sticky top-2 sm:top-3 z-50 px-3 sm:px-6 pointer-events-none">
      <nav className="pointer-events-auto mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-slate-200/90 bg-white/90 px-4 sm:px-6 backdrop-blur-xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-slate-300/90">
        {/* Brand Logo with Interactive Hover */}
        <Logo href="/" size="md" />

        {/* Center Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 rounded-full border border-slate-200/70 bg-slate-100/70 p-1 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ease-out ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-xs hover:brightness-105"
                    : "text-slate-600 hover:text-emerald-800 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right CTA / Auth controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={dashboardHref}
                className="group flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-emerald-700 hover:to-teal-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <LayoutDashboard size={14} className="group-hover:rotate-6 transition-transform" />
                <span>Go to Dashboard</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/70 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 shadow-2xs"
              >
                <LogOut size={13} />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 hover:-translate-y-0.5 active:translate-y-0 shadow-2xs transition-all duration-150"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="group flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
              >
                <span>Student Sign Up</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {currentUser && (
            <Link
              href={dashboardHref}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white sm:hidden hover:bg-emerald-700 transition"
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden mx-auto mt-2 max-w-7xl rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={14} className={isActive ? "text-white" : "text-slate-400"} />
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:border-slate-300 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  Student Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
