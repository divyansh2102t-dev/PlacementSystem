"use client";

import React, { useState, useEffect } from "react";
import { User, Student } from "@/types";
import { getClientUser } from "@/lib/auth";
import { ExpandableSidebar } from "./ExpandableSidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onSearch?: (q: string) => void;
  requiredRole?: "admin" | "student";
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  onSearch,
}: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const active = getClientUser();
    if (!active) {
      window.location.href = "/login";
      return;
    }
    setUser(active);

    if (active.role === "student" && active.studentId) {
      fetch(`/api/students?id=${active.studentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setStudent(data);
        })
        .catch(console.error);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-transparent backdrop-blur-xs">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-lg backdrop-blur-md text-xs sm:text-sm font-semibold text-slate-700">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <span>Opening PlaceHub Portal...</span>
        </div>
      </div>
    );
  }

  const role = user.role;

  return (
    <main className="min-h-screen bg-transparent p-3 sm:p-5 lg:p-6 font-sans text-slate-900 relative">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1600px] flex-col">
        {/* Main Application Flow - Open & Consistent Layout without enclosing box border */}
        <div className="flex flex-1 gap-4 lg:gap-6 pb-16 sm:pb-4 transition-all">
          {/* Collapsible Sidebar */}
          <ExpandableSidebar role={role} />

          {/* Main Content Viewport */}
          <section className="flex min-w-0 flex-1 flex-col">
            <Header
              user={user}
              student={student}
              title={title}
              subtitle={subtitle}
              onSearch={onSearch}
            />

            <div className="mt-3.5 flex-1">{children}</div>
          </section>
        </div>

        {/* Clean Footer */}
        <footer className="hidden sm:flex items-center justify-between px-2 pt-3 text-xs text-slate-500 font-medium border-t border-slate-200/60 mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">PlaceHub Portal</span>
            <span>·</span>
            <span>University Campus Placements</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">Active Season 2026–2027</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Secure Role-Based Session</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
