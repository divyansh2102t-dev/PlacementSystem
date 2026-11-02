"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CompanyVerticalCard } from "@/components/student/CompanyVerticalCard";
import { AdminCompanyModal } from "@/components/admin/AdminCompanyModal";
import { AdminCompanyApplicantsModal } from "@/components/admin/AdminCompanyApplicantsModal";
import { CompanyStagesModal } from "@/components/admin/CompanyStagesModal";
import { HeadlineStatsModal } from "@/components/admin/HeadlineStatsModal";
import { CompanyDetailModal } from "@/components/student/CompanyDetailModal";
import { CompanyDrive, Application, Student } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { formatCurrencyLpa } from "@/lib/utils";
import { StageBadge } from "@/components/ui/Badge";
import {
  Building2,
  Users,
  Layers,
  Award,
  ArrowRight,
  Plus,
  CheckCircle2,
  Settings,
  Filter,
  BarChart3,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { notify } = useToast();
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Window Tab State
  const [activeWindowTab, setActiveWindowTab] = useState<
    "drives" | "pipeline" | "offers" | "stages"
  >("drives");

  // Modals
  const [companyToEdit, setCompanyToEdit] = useState<CompanyDrive | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyForApplicants, setCompanyForApplicants] = useState<CompanyDrive | null>(null);
  const [companyForStages, setCompanyForStages] = useState<CompanyDrive | null>(null);
  const [companyForDetail, setCompanyForDetail] = useState<CompanyDrive | null>(null);
  const [isHeadlineModalOpen, setIsHeadlineModalOpen] = useState(false);

  const loadAll = async () => {
    try {
      const [resC, resA, resS] = await Promise.all([
        fetch("/api/companies").then((r) => r.json()),
        fetch("/api/applications").then((r) => r.json()),
        fetch("/api/students").then((r) => r.json()),
      ]);

      if (Array.isArray(resC)) setCompanies(resC);
      if (Array.isArray(resA)) setApplications(resA);
      if (Array.isArray(resS)) setStudents(resS);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveCompany = async (companyData: Partial<CompanyDrive>) => {
    try {
      const isEdit = !!companyToEdit?.id;
      const url = "/api/companies";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit ? { ...companyData, id: companyToEdit.id } : companyData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify(data.message || "Drive saved successfully!");
      loadAll();
    } catch (err: any) {
      notify(err.message || "Failed to save company drive", "error");
    }
  };

  const handleDeleteCompany = async (company: CompanyDrive) => {
    if (!confirm(`Are you sure you want to delete ${company.companyName}?`)) return;
    try {
      const res = await fetch(`/api/companies?id=${company.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify("Recruitment drive removed.");
      loadAll();
    } catch (err: any) {
      notify(err.message || "Failed to delete company", "error");
    }
  };

  const handleUpdateApplicationStatus = async (
    appId: number,
    stage: string,
    remark?: string
  ) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, stage, remarks: remark }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify(data.message || `Updated status to ${stage}!`);
      loadAll();
    } catch (err: any) {
      notify(err.message || "Failed to update status", "error");
    }
  };

  const handleBulkUpdateApplications = async (
    appIds: number[],
    stage: string,
    remark?: string
  ) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulk: true, appIds, stage, remarks: remark }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify(data.message || `Bulk updated ${data.count} applications!`);
      loadAll();
    } catch (err: any) {
      notify(err.message || "Bulk update failed", "error");
    }
  };

  const placedStudents = students.filter((s) => s.status === "Placed");
  const placementRate = students.length > 0 ? Math.round((placedStudents.length / students.length) * 100) : 0;

  return (
    <DashboardLayout
      title="Placement Office Executive Dashboard"
      subtitle="Campus Placement Management · Drive Operations, Custom Stage Pipelines & Verification Desk"
    >
      <div className="space-y-4">
        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Placement Rate</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-transparent transition-all duration-200">
                <Award size={16} />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 group-hover:scale-105 transition-transform duration-200">
              {placementRate}%
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {placedStudents.length} of {students.length} students placed
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-slate-800 transition-colors">Active Drives</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 group-hover:bg-slate-900 group-hover:text-white group-hover:border-transparent transition-all duration-200">
                <Building2 size={16} />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-200">
              {companies.length}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Published recruiters</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-slate-800 transition-colors">Total Applications</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 group-hover:bg-slate-900 group-hover:text-white group-hover:border-transparent transition-all duration-200">
                <Layers size={16} />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-200">
              {applications.length}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Candidate submissions</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-slate-800 transition-colors">Batch Size</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 group-hover:bg-slate-900 group-hover:text-white group-hover:border-transparent transition-all duration-200">
                <Users size={16} />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-200">
              {students.length}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Academic batch 2027</p>
          </div>
        </div>

        {/* Operations Hub Banner */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 p-5 sm:p-6 text-white shadow-xl border border-emerald-700/40 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Placement Coordination Desk
                </h3>
                <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed max-w-lg">
                  Publish corporate recruitment drives, configure customized evaluation rounds, advance candidates through stages, and issue offers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsHeadlineModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5 shadow-xs backdrop-blur-xs"
                  title="Configure Highest Package, Average CTC, Placement Rate & Recruiting Partners"
                >
                  <BarChart3 size={14} /> Manage Homepage Stats
                </button>
                <button
                  onClick={() => {
                    setCompanyToEdit(null);
                    setIsCompanyModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-4 py-2.5 text-xs font-extrabold text-slate-950 hover:brightness-105 transition-all duration-200 hover:-translate-y-0.5 shadow-xs shrink-0"
                >
                  <Plus size={14} /> Add New Drive
                </button>
              </div>
            </div>

            <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <Link
                href="/admin/companies"
                className="flex items-center justify-between rounded-xl bg-white/10 px-3.5 py-2.5 font-bold hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-xs border border-white/15"
              >
                <span>All Companies ({companies.length})</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/admin/applications"
                className="flex items-center justify-between rounded-xl bg-white/10 px-3.5 py-2.5 font-bold hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-xs border border-white/15"
              >
                <span>Review Applications ({applications.length})</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/admin/students"
                className="flex items-center justify-between rounded-xl bg-white/10 px-3.5 py-2.5 font-bold hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-xs border border-white/15"
              >
                <span>Students & User Access</span>
                <Users size={13} />
              </Link>
            </div>
          </div>

          {/* Confirmed Placements Wall */}
          <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              Latest Confirmed Offers
            </h3>

            <div className="space-y-2">
              {placedStudents.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-white/90 p-2.5 border border-slate-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {s.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {s.rollNo} · {s.department} (CGPA {s.cgpa})
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 shrink-0 border border-emerald-200">
                    ₹{s.highestOfferLpa} LPA
                  </span>
                </div>
              ))}

              {placedStudents.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">
                  No confirmed offers recorded yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE DISPLAY WINDOW WITH BUTTONS (ADMIN)
        ========================================================================== */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 sm:p-6 shadow-xs">
          {/* Header & Interactive Control Buttons */}
          <div className="flex flex-col gap-3 pb-4 border-b border-slate-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 size={18} className="text-emerald-700" />
                  Recruitment Operations & Candidate Window
                </h3>
                <p className="text-xs text-slate-500">
                  Click the buttons below to switch active display cards and review stage pipelines.
                </p>
              </div>

              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 self-start sm:self-auto">
                <Filter size={12} />
                <span>Active View: {activeWindowTab.toUpperCase()}</span>
              </span>
            </div>

            {/* BUTTONS BAR IN THE WINDOW */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveWindowTab("drives")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  activeWindowTab === "drives"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs border border-transparent"
                    : "bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white hover:text-emerald-800 hover:border-emerald-300 shadow-2xs"
                }`}
              >
                <Building2 size={14} />
                <span>Active Recruitment Drives ({companies.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWindowTab("pipeline")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  activeWindowTab === "pipeline"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs border border-transparent"
                    : "bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white hover:text-emerald-800 hover:border-emerald-300 shadow-2xs"
                }`}
              >
                <Layers size={14} />
                <span>Candidate Pipeline by Stage ({applications.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWindowTab("stages")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  activeWindowTab === "stages"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs border border-transparent"
                    : "bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white hover:text-emerald-800 hover:border-emerald-300 shadow-2xs"
                }`}
              >
                <Settings size={14} />
                <span>Manage Custom Hiring Stages</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWindowTab("offers")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  activeWindowTab === "offers"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs border border-transparent"
                    : "bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white hover:text-emerald-800 hover:border-emerald-300 shadow-2xs"
                }`}
              >
                <Award size={14} />
                <span>Confirmed Offers ({placedStudents.length})</span>
              </button>
            </div>
          </div>

          {/* DISPLAY WINDOW VIEW CONTENT */}
          <div className="pt-4">
            {/* View 1: Active Drives */}
            {activeWindowTab === "drives" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Click "Review Applicants" on any card to evaluate candidate rounds:</span>
                  <Link
                    href="/admin/companies"
                    className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Full drive directory</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                {companies.map((company) => (
                  <CompanyVerticalCard
                    key={company.id}
                    company={company}
                    isAdmin={true}
                    onReviewApplicants={(c) => setCompanyForApplicants(c)}
                    onEdit={(c) => {
                      setCompanyToEdit(c);
                      setIsCompanyModalOpen(true);
                    }}
                    onDelete={handleDeleteCompany}
                    onViewDetails={(c) => setCompanyForDetail(c)}
                  />
                ))}
              </div>
            )}

            {/* View 2: Candidate Pipeline by Stage */}
            {activeWindowTab === "pipeline" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Candidate applications categorized by round:</span>
                  <Link
                    href="/admin/applications"
                    className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Open full pipeline manager</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Candidate</th>
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Branch</th>
                        <th className="p-3">Company Drive</th>
                        <th className="p-3">Package</th>
                        <th className="p-3">Current Round</th>
                        <th className="p-3 text-right">Quick Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{app.studentName}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{app.rollNo}</td>
                          <td className="p-3">
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                              {app.department}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{app.companyName}</td>
                          <td className="p-3 font-bold text-emerald-700">₹{app.ctcLpa} LPA</td>
                          <td className="p-3">
                            <StageBadge stage={app.stage} />
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                const comp = companies.find((c) => c.id === app.driveId);
                                if (comp) setCompanyForApplicants(comp);
                              }}
                              className="rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold hover:bg-emerald-100 transition"
                            >
                              Open Pipeline
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* View 3: Manage Custom Hiring Stages */}
            {activeWindowTab === "stages" && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 mb-1">
                  <span>Each company can have customized, non-hardcoded evaluation stages configured in any order:</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {companies.map((company) => {
                    const stgs = company.stages || [];
                    return (
                      <div
                        key={company.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-300 transition"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {company.companyName}
                          </h4>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                            {stgs.length} stages
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{company.roleTitle}</p>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {stgs.slice(0, 4).map((s, idx) => (
                            <span
                              key={s.id || idx}
                              className="rounded-md bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-[9px] text-slate-600 font-medium"
                            >
                              {s.order}. {s.name}
                            </span>
                          ))}
                          {stgs.length > 4 && (
                            <span className="text-[9px] text-slate-400 self-center">
                              +{stgs.length - 4} more
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setCompanyForStages(company)}
                          className="w-full mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 py-1.5 text-xs font-bold hover:bg-emerald-100 transition"
                        >
                          <Settings size={12} />
                          <span>Configure Hiring Stages</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View 4: Confirmed Placements */}
            {activeWindowTab === "offers" && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 mb-1">
                  <span>Students who successfully cleared all hiring rounds and accepted offers:</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Student</th>
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Branch</th>
                        <th className="p-3">Verified CGPA</th>
                        <th className="p-3">CTC Offer</th>
                        <th className="p-3">Placement Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {placedStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{s.name}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{s.rollNo}</td>
                          <td className="p-3 font-semibold text-slate-700">{s.department}</td>
                          <td className="p-3 font-bold text-slate-900">{s.cgpa}</td>
                          <td className="p-3 font-black text-emerald-700">₹{s.highestOfferLpa} LPA</td>
                          <td className="p-3">
                            <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                              Placed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Add / Edit Company */}
      <AdminCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          setCompanyToEdit(null);
        }}
        companyToEdit={companyToEdit}
        onSave={handleSaveCompany}
      />

      {/* MODAL: Review Applicants per company with stage tabs */}
      <AdminCompanyApplicantsModal
        isOpen={!!companyForApplicants}
        onClose={() => setCompanyForApplicants(null)}
        company={companyForApplicants}
        applications={
          companyForApplicants
            ? applications.filter((a) => a.driveId === companyForApplicants.id)
            : []
        }
        onUpdateStatus={handleUpdateApplicationStatus}
        onBulkUpdate={handleBulkUpdateApplications}
        onCompanyUpdated={(c) => {
          setCompanies((prev) => prev.map((x) => (x.id === c.id ? c : x)));
          setCompanyForApplicants(c);
        }}
      />

      {/* MODAL: Configure Custom Stages */}
      <CompanyStagesModal
        isOpen={!!companyForStages}
        onClose={() => setCompanyForStages(null)}
        company={companyForStages}
        onStagesUpdated={(updated) => {
          setCompanies((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        }}
      />

      {/* MODAL: Company Detail View */}
      <CompanyDetailModal
        isOpen={!!companyForDetail}
        onClose={() => setCompanyForDetail(null)}
        company={companyForDetail}
      />

      {/* MODAL: Manage Headline Stats (Highest Package, Average CTC, Placement Rate, etc.) */}
      <HeadlineStatsModal
        isOpen={isHeadlineModalOpen}
        onClose={() => setIsHeadlineModalOpen(false)}
      />
    </DashboardLayout>
  );
}
