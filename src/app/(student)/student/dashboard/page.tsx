"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CompanyVerticalCard } from "@/components/student/CompanyVerticalCard";
import { ApplicationsTimeline } from "@/components/student/ApplicationsTimeline";
import { ApplyModal } from "@/components/student/ApplyModal";
import { CompanyDetailModal } from "@/components/student/CompanyDetailModal";
import { CompanyDrive, Student, Application, User } from "@/types";
import { getClientUser } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import { checkEligibility } from "@/lib/eligibility";
import {
  GraduationCap,
  Building2,
  Layers,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Filter,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { notify } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view button state
  const [activeWindowTab, setActiveWindowTab] = useState<
    "eligible" | "applications" | "all" | "superdream"
  >("eligible");

  const [selectedCompanyForApply, setSelectedCompanyForApply] = useState<CompanyDrive | null>(null);
  const [selectedCompanyForDetail, setSelectedCompanyForDetail] = useState<CompanyDrive | null>(null);

  const loadData = async () => {
    try {
      const activeUser = getClientUser();
      setCurrentUser(activeUser);
      const studentId = activeUser.studentId || 1;

      const [resStudent, resCompanies, resApps] = await Promise.all([
        fetch(`/api/students?id=${studentId}`).then((r) => r.json()),
        fetch("/api/companies").then((r) => r.json()),
        fetch(`/api/applications?studentId=${studentId}`).then((r) => r.json()),
      ]);

      if (!resStudent.error) setStudent(resStudent);
      if (Array.isArray(resCompanies)) setCompanies(resCompanies);
      if (Array.isArray(resApps)) setApplications(resApps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyConfirm = async (driveId: number) => {
    if (!student) return;
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.id, driveId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify(data.message || "Applied successfully!");
      loadData();
    } catch (err: any) {
      notify(err.message || "Application submission failed", "error");
    }
  };

  // Filter groups
  const eligibleCompanies = companies.filter((c) => {
    if (!student) return false;
    const res = checkEligibility(student, c);
    return res.eligible;
  });

  const superDreamCompanies = companies.filter(
    (c) => c.tier === "Super Dream" || c.ctcLpa >= 20.0
  );

  // Profile completion calculation
  let profileCompletion = 50;
  if (student?.skills && student.skills.length >= 3) profileCompletion += 20;
  if (student?.phone) profileCompletion += 15;
  if (student?.resumeUrl) profileCompletion += 15;

  return (
    <DashboardLayout
      title="Student Placement Dashboard"
      subtitle="Interactive placement desk · Review drives, eligibility, and custom stage milestones"
    >
      <div className="space-y-4">
        {/* Welcome & Role Verification Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-4 sm:p-5 text-white shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200 border border-emerald-400/30">
                  Role: {currentUser?.role === "admin" ? "Administrator" : "Student (Candidate)"}
                </span>
                {currentUser?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white hover:bg-white/30 transition"
                  >
                    Switch to Admin View →
                  </Link>
                )}
              </div>
              <h2 className="mt-2 text-xl font-bold">
                Welcome back, {student?.name || currentUser?.name || "Student"}!
              </h2>
              <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed">
                Department: <strong>{student?.department || "CSE"}</strong> · Roll No:{" "}
                <strong>{student?.rollNo || "21CS001"}</strong> · Verified CGPA:{" "}
                <strong>{student?.cgpa || "9.35"}</strong> · Active Backlogs:{" "}
                <strong>{student?.activeBacklogs || 0}</strong>
              </p>
            </div>

            {/* Profile Completion Dial */}
            <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-xs min-w-[210px] border border-white/10">
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                <span>Profile Completion</span>
                <span className="text-emerald-300">{profileCompletion}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <Link
                href="/student/profile"
                className="mt-2 block text-right text-[10px] font-semibold text-emerald-200 hover:text-white underline"
              >
                Update Profile & Resume →
              </Link>
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Eligible Drives</span>
              <span className="text-emerald-700">
                <CheckCircle2 size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-emerald-700">
              {eligibleCompanies.length}
            </p>
            <p className="text-[10px] text-slate-400">Of {companies.length} active drives</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">My Applications</span>
              <span className="text-slate-600">
                <Layers size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {applications.length}
            </p>
            <p className="text-[10px] text-slate-400">Submitted drives</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Accepted Offers</span>
              <span className="text-emerald-600">
                <Award size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-emerald-700">
              {applications.filter((a) => a.stage === "Accepted" || a.stage.toLowerCase().includes("hired")).length}
            </p>
            <p className="text-[10px] text-slate-400">Verified placement offers</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Placement Status</span>
              <span className="text-emerald-700">
                <GraduationCap size={16} />
              </span>
            </div>
            <p className="mt-1 text-lg font-black text-slate-900 truncate">
              {student?.status || "In Process"}
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold truncate">
              {student?.highestOfferLpa ? `₹${student.highestOfferLpa} LPA Offer` : "Actively Eligible"}
            </p>
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE DISPLAY WINDOW WITH BUTTONS
        ========================================================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          {/* Header & Interactive Control Buttons */}
          <div className="flex flex-col gap-3 pb-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-700" />
                  Placement Window & Applications Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Select a category button below to display corresponding recruitment drives and stage progress in this window.
                </p>
              </div>

              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 self-start sm:self-auto">
                <Filter size={12} />
                <span>Active Filter: {activeWindowTab.toUpperCase()}</span>
              </span>
            </div>

            {/* BUTTONS BAR IN THE WINDOW */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveWindowTab("eligible")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition border ${
                  activeWindowTab === "eligible"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <CheckCircle2 size={14} />
                <span>Eligible for Me ({eligibleCompanies.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWindowTab("applications")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition border ${
                  activeWindowTab === "applications"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Layers size={14} />
                <span>My Applications & Stages ({applications.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWindowTab("all")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition border ${
                  activeWindowTab === "all"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Building2 size={14} />
                <span>All Available Drives ({companies.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWindowTab("superdream")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition border ${
                  activeWindowTab === "superdream"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Award size={14} />
                <span>Super Dream (₹20+ LPA) ({superDreamCompanies.length})</span>
              </button>
            </div>
          </div>

          {/* DISPLAY WINDOW VIEW CONTENT */}
          <div className="pt-4">
            {/* View 1: Eligible Companies */}
            {activeWindowTab === "eligible" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Displaying verified companies matching your academic criteria:</span>
                  <Link
                    href="/student/companies"
                    className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Browse with full filters</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                {eligibleCompanies.map((company) => {
                  const existingApp = applications.find((a) => a.driveId === company.id);
                  return (
                    <CompanyVerticalCard
                      key={company.id}
                      company={company}
                      student={student}
                      existingApplication={existingApp}
                      onApply={(c) => setSelectedCompanyForApply(c)}
                      onViewDetails={(c) => setSelectedCompanyForDetail(c)}
                    />
                  );
                })}

                {eligibleCompanies.length === 0 && (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                    No eligible drives at this moment. Check requirements in the "All Available Drives" tab.
                  </div>
                )}
              </div>
            )}

            {/* View 2: My Applications & Custom Stage Progress */}
            {activeWindowTab === "applications" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Live round-by-round hiring progress for your submitted applications:</span>
                  <Link
                    href="/student/applications"
                    className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Full application history</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                <ApplicationsTimeline applications={applications} companies={companies} />
              </div>
            )}

            {/* View 3: All Available Companies */}
            {activeWindowTab === "all" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>All recruitment drives published for the current academic season:</span>
                </div>

                {companies.map((company) => {
                  const existingApp = applications.find((a) => a.driveId === company.id);
                  return (
                    <CompanyVerticalCard
                      key={company.id}
                      company={company}
                      student={student}
                      existingApplication={existingApp}
                      onApply={(c) => setSelectedCompanyForApply(c)}
                      onViewDetails={(c) => setSelectedCompanyForDetail(c)}
                    />
                  );
                })}
              </div>
            )}

            {/* View 4: Super Dream Tier */}
            {activeWindowTab === "superdream" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>High-package recruitment opportunities (CTC ≥ ₹20.0 LPA):</span>
                </div>

                {superDreamCompanies.map((company) => {
                  const existingApp = applications.find((a) => a.driveId === company.id);
                  return (
                    <CompanyVerticalCard
                      key={company.id}
                      company={company}
                      student={student}
                      existingApplication={existingApp}
                      onApply={(c) => setSelectedCompanyForApply(c)}
                      onViewDetails={(c) => setSelectedCompanyForDetail(c)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Apply Confirmation */}
      <ApplyModal
        isOpen={!!selectedCompanyForApply}
        onClose={() => setSelectedCompanyForApply(null)}
        company={selectedCompanyForApply}
        student={student}
        onConfirmApply={handleApplyConfirm}
      />

      {/* MODAL: Company Detail View */}
      <CompanyDetailModal
        isOpen={!!selectedCompanyForDetail}
        onClose={() => setSelectedCompanyForDetail(null)}
        company={selectedCompanyForDetail}
      />
    </DashboardLayout>
  );
}
