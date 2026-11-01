"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CompanyVerticalCard } from "@/components/student/CompanyVerticalCard";
import { ApplyModal } from "@/components/student/ApplyModal";
import { CompanyDetailModal } from "@/components/student/CompanyDetailModal";
import { CompanyDrive, Student, Application } from "@/types";
import { getClientUser } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import { checkEligibility } from "@/lib/eligibility";
import {
  GraduationCap,
  Building2,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { notify } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCompanyForApply, setSelectedCompanyForApply] = useState<CompanyDrive | null>(null);
  const [selectedCompanyForDetail, setSelectedCompanyForDetail] = useState<CompanyDrive | null>(null);

  const loadData = async () => {
    try {
      const activeUser = getClientUser();
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

  // Eligibility summary
  const eligibleCompanies = companies.filter((c) => {
    if (!student) return false;
    const res = checkEligibility(student, c);
    return res.eligible;
  });

  const appliedDriveIds = applications.map((a) => a.driveId);

  // Profile completion meter
  let profileCompletion = 50;
  if (student?.skills && student.skills.length >= 3) profileCompletion += 20;
  if (student?.phone) profileCompletion += 15;
  if (student?.resumeUrl) profileCompletion += 15;

  return (
    <DashboardLayout
      title="Student Dashboard"
      subtitle="Overview of your placement eligibility, active drives, and application statuses"
    >
      <div className="space-y-4">
        {/* Welcome & Profile Completion Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-[#1b4332] p-4 sm:p-5 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200 border border-emerald-400/30">
                Placement Batch 2023–2027
              </span>
              <h2 className="mt-1.5 text-lg font-bold">
                Welcome, {student?.name || "Student"}!
              </h2>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Department: <strong>{student?.department}</strong> · Verified CGPA:{" "}
                <strong>{student?.cgpa}</strong> · Active Backlogs:{" "}
                <strong>{student?.activeBacklogs}</strong>
              </p>
            </div>

            {/* Profile Completion Dial */}
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs min-w-[200px]">
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

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Eligible Drives</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {eligibleCompanies.length}
            </p>
            <p className="text-[10px] text-slate-400">Of {companies.length} total drives</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Submitted Applications</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                <Layers size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {applications.length}
            </p>
            <p className="text-[10px] text-slate-400">Active submissions</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Accepted Offers</span>
              <span className="text-emerald-600">
                <Sparkles size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {applications.filter((a) => a.stage === "Accepted").length}
            </p>
            <p className="text-[10px] text-slate-400">Verified placement offers</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Placement Status</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                <GraduationCap size={16} />
              </span>
            </div>
            <p className="mt-1 text-lg font-black text-slate-900 dark:text-white truncate">
              {student?.status || "Unplaced"}
            </p>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
              {student?.highestOfferLpa ? `₹${student.highestOfferLpa} LPA Offer` : "Actively Eligible"}
            </p>
          </div>
        </div>

        {/* Vertical Stack Company Drives for Student */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={16} className="text-emerald-700 dark:text-emerald-400" />
                Featured Campus Recruitment Drives (Vertical Stack)
              </h3>
              <p className="text-xs text-slate-500">
                Showing all campus hiring opportunities with live eligibility check for your profile
              </p>
            </div>
            <Link
              href="/student/companies"
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
            >
              <span>View All ({companies.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {companies.slice(0, 4).map((company) => {
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
        </div>
      </div>

      {/* MODAL: Confirm Apply */}
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
