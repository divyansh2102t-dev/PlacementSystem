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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <span>Opening PlaceHub Portal...</span>
        </div>
      </div>
    );
  }

  const role = user.role;

  return (
    <main className="min-h-screen bg-slate-50/70 p-2 sm:p-4 lg:p-6 font-sans text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1580px] flex-col">
        {/* Main Application Container - Clean, crisp, NO black borders */}
        <div className="flex flex-1 gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs pb-16 sm:pb-3">
          {/* Collapsible Sidebar */}
          <ExpandableSidebar role={role} />

          {/* Main Content Viewport */}
          <section className="flex min-w-0 flex-1 flex-col px-1 pb-1 sm:px-3">
            <Header
              user={user}
              student={student}
              title={title}
              subtitle={subtitle}
              onSearch={onSearch}
            />

            <div className="mt-3 flex-1">{children}</div>
          </section>
        </div>

        {/* Clean Footer */}
        <footer className="hidden sm:flex items-center justify-between px-3 pt-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">PlaceHub Portal</span>
            <span>·</span>
            <span>Campus Placement System</span>
            <span>·</span>
            <span>All systems operational</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Academic Year 2026–2027</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
