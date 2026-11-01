"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CompanyVerticalCard } from "@/components/student/CompanyVerticalCard";
import { AdminCompanyModal } from "@/components/admin/AdminCompanyModal";
import { AdminCompanyApplicantsModal } from "@/components/admin/AdminCompanyApplicantsModal";
import { CompanyStagesModal } from "@/components/admin/CompanyStagesModal";
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
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Placement Rate</span>
              <span className="text-emerald-700">
                <Award size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-emerald-700">
              {placementRate}%
            </p>
            <p className="text-[10px] text-slate-400">
              {placedStudents.length} of {students.length} students placed
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Drives</span>
              <span className="text-slate-600">
                <Building2 size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {companies.length}
            </p>
            <p className="text-[10px] text-slate-400">Published recruiters</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Applications</span>
              <span className="text-slate-600">
                <Layers size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {applications.length}
            </p>
            <p className="text-[10px] text-slate-400">Candidate submissions</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Batch Size</span>
              <span className="text-slate-600">
                <Users size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {students.length}
            </p>
            <p className="text-[10px] text-slate-400">Academic batch 2027</p>
          </div>
        </div>

        {/* Operations Hub Banner */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-4 sm:p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  Placement Coordination Desk
                </h3>
                <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed max-w-lg">
                  Publish corporate recruitment drives, configure customized evaluation rounds, advance candidates through stages, and issue offers.
                </p>
              </div>

              <button
                onClick={() => {
                  setCompanyToEdit(null);
                  setIsCompanyModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-xs shrink-0"
              >
                <Plus size={14} /> Add New Drive
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <Link
                href="/admin/companies"
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 font-medium hover:bg-white/20 transition backdrop-blur-xs border border-white/10"
              >
                <span>All Companies ({companies.length})</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/admin/applications"
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 font-medium hover:bg-white/20 transition backdrop-blur-xs border border-white/10"
              >
                <span>Review Applications ({applications.length})</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/admin/students"
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 font-medium hover:bg-white/20 transition backdrop-blur-xs border border-white/10"
              >
                <span>Students & User Access</span>
                <Users size={13} />
              </Link>
            </div>
          </div>

          {/* Confirmed Placements Wall */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Latest Confirmed Offers
            </h3>

            <div className="space-y-2">
              {placedStudents.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {s.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {s.rollNo} · {s.department} (CGPA {s.cgpa})
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 shrink-0 border border-emerald-200">
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
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          {/* Header & Interactive Control Buttons */}
          <div className="flex flex-col gap-3 pb-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-700" />
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
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition border ${
                  activeWindowTab === "drives"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Building2 size={14} />
                <span>Active Recruitment Drives ({companies.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWindowTab("pipeline")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition border ${
                  activeWindowTab === "pipeline"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Layers size={14} />
                <span>Candidate Pipeline by Stage ({applications.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWindowTab("stages")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition border ${
                  activeWindowTab === "stages"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Settings size={14} />
                <span>Manage Custom Hiring Stages</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWindowTab("offers")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition border ${
                  activeWindowTab === "offers"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
    </DashboardLayout>
  );
}
