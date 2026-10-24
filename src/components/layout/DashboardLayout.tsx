"use client";

import React, { useState, useEffect } from "react";
import { User, Student } from "@/types";
import { getClientUser } from "@/lib/auth";
import { ExpandableSidebar } from "./ExpandableSidebar";
import { Header } from "./Header";
import { Modal } from "@/components/ui/Modal";
import { Database, BookOpen, Layers } from "lucide-react";

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
  requiredRole,
}: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const active = getClientUser();
    setUser(active);

    // If student, fetch student details
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
      <div className="flex h-screen items-center justify-center bg-[#d8eedf] dark:bg-slate-950">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <span>Loading PlaceHub Portal...</span>
        </div>
      </div>
    );
  }

  const role = user.role;

  return (
    <main className="min-h-screen px-2.5 py-2.5 transition-colors sm:px-5 sm:py-4 lg:px-7 font-sans bg-[#d8eedf] dark:bg-slate-950 text-[#242926] dark:text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1550px] flex-col">
        {/* Main Application Container */}
        <div className="flex flex-1 gap-2.5 rounded-[22px] border-[3px] border-[#252a27] bg-[#f4f5ec] p-2.5 shadow-[0_8px_0_rgba(20,40,30,0.06)] transition-colors dark:border-slate-800 dark:bg-slate-900 pb-16 sm:pb-2.5">
          {/* Hover-To-Expand Sidebar */}
          <ExpandableSidebar
            role={role}
            onOpenHelp={() => setHelpOpen(true)}
          />

          {/* Main Content Viewport */}
          <section className="flex min-w-0 flex-1 flex-col px-1 pb-1 sm:px-3">
            <Header
              user={user}
              student={student}
              title={title}
              subtitle={subtitle}
              onSearch={onSearch}
            />

            <div className="mt-2 flex-1">{children}</div>
          </section>
        </div>

        {/* Bottom Status Footer (Original design language) */}
        <footer className="hidden sm:flex flex-wrap items-center justify-between px-2 pt-2 text-[10px] text-emerald-950/70 dark:text-emerald-400/60 font-medium">
          <div className="flex items-center gap-2">
            <span>PLACEHUB SYSTEM</span>
            <span>·</span>
            <span>STATUS: DATABASE ONLINE</span>
            <span>·</span>
            <span className="font-mono">schema.sql 3NF active</span>
          </div>
          <div className="flex items-center gap-3">
            <span>COLLEGE CAMPUS RECRUITMENT 2026–2027</span>
            <span>TPO & PLACEMENT PORTAL</span>
          </div>
        </footer>
      </div>

      {/* HELP & DBMS DOCUMENTATION MODAL */}
      <Modal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="DBMS Placement System Architecture & Help"
        subtitle="3NF Relational Database Specifications & Operation Manual"
        icon={<BookOpen size={18} />}
        maxWidth="2xl"
      >
        <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
          <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Database size={14} /> Relational Schema Model (Third Normal Form)
            </h4>
            <p className="mt-1 leading-relaxed">
              This system models the entire university placement life-cycle using 6 normalized relational entities:
              <strong className="text-emerald-950 dark:text-emerald-200"> Companies, Students, JobDrives, Applications, InterviewSchedules, and PlacementOffers</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl border p-3 dark:border-slate-800">
              <h5 className="font-bold text-slate-900 dark:text-white">Student Rules</h5>
              <ul className="mt-1 list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                <li>Automated eligibility checks enforce CGPA cutoffs and active backlog maximums.</li>
                <li>Unique constraint prevents applying to the same drive more than once.</li>
                <li>Updating branch or backlogs dynamically re-evaluates all drive eligibility.</li>
              </ul>
            </div>
            <div className="rounded-xl border p-3 dark:border-slate-800">
              <h5 className="font-bold text-slate-900 dark:text-white">Admin Capabilities</h5>
              <ul className="mt-1 list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                <li>Create, edit, and delete company recruitment drives with specific department rules.</li>
                <li>Single & bulk candidate status updating (Accept / Reject) with live student reflection.</li>
                <li>CSV / Excel import and export for students and company drives.</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </main>
  );
}
