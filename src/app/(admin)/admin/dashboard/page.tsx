"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CompanyVerticalCard } from "@/components/student/CompanyVerticalCard";
import { AdminCompanyModal } from "@/components/admin/AdminCompanyModal";
import { AdminCompanyApplicantsModal } from "@/components/admin/AdminCompanyApplicantsModal";
import { CompanyDetailModal } from "@/components/student/CompanyDetailModal";
import { CompanyDrive, Application, Student, ApplicationStage } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { formatCurrencyLpa } from "@/lib/utils";
import {
  Building2,
  Users,
  Layers,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  Database,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { notify } = useToast();
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [companyToEdit, setCompanyToEdit] = useState<CompanyDrive | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyForApplicants, setCompanyForApplicants] = useState<CompanyDrive | null>(null);
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
    stage: ApplicationStage,
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
    stage: ApplicationStage,
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
      title="Placement Cell Executive Dashboard"
      subtitle="University Placement Operations Desk · Drive Management & Verification Control"
    >
      <div className="space-y-4">
        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Placement Rate</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                <Award size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {placementRate}%
            </p>
            <p className="text-[10px] text-slate-400">
              {placedStudents.length} of {students.length} students placed
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Drives</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                <Building2 size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {companies.length}
            </p>
            <p className="text-[10px] text-slate-400">Recruitment drives</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Applications</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                <Layers size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {applications.length}
            </p>
            <p className="text-[10px] text-slate-400">Submitted candidates</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Registered Batch</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                <Users size={16} />
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {students.length}
            </p>
            <p className="text-[10px] text-slate-400">Academic batch 2027</p>
          </div>
        </div>

        {/* Row 2: Operations Hub & Quick Actions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          {/* Quick Operations Hub (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-gradient-to-br from-emerald-800 to-[#1b4332] p-4 sm:p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-300" />
                  Placement Operations Desk
                </h3>
                <p className="mt-1 text-xs text-emerald-100/80 leading-relaxed max-w-lg">
                  Coordinate corporate campus recruitment, screen applicant resumes against CGPA rules, and issue offers.
                </p>
              </div>

              <button
                onClick={() => {
                  setCompanyToEdit(null);
                  setIsCompanyModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-sm shrink-0"
              >
                <Plus size={14} /> Add New Drive
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <Link
                href="/admin/companies"
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 font-medium hover:bg-white/20 transition backdrop-blur-xs"
              >
                <span>Manage All Drives ({companies.length})</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/admin/applications"
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 font-medium hover:bg-white/20 transition backdrop-blur-xs"
              >
                <span>Review Applications ({applications.length})</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/admin/dbms-explorer"
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 font-medium hover:bg-white/20 transition backdrop-blur-xs"
              >
                <span>DBMS Relational SQL</span>
                <Database size={13} />
              </Link>
            </div>
          </div>

          {/* Confirmed Placements Wall (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Latest Confirmed Offers
            </h3>

            <div className="space-y-2">
              {placedStudents.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-2 dark:bg-slate-900/50"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {s.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {s.rollNo} · {s.department} (CGPA {s.cgpa})
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    ₹{s.highestOfferLpa} LPA
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Recruitment Drives in Vertical Stack (Requirement 3 & 5) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={16} className="text-emerald-700 dark:text-emerald-400" />
                Company Recruitment Drives (Vertical Stack & Applicant Review)
              </h3>
              <p className="text-xs text-slate-500">
                Click Review Applicants on any company to accept or reject candidates
              </p>
            </div>
            <Link
              href="/admin/companies"
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
            >
              <span>All Companies</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {companies.slice(0, 4).map((company) => (
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

      {/* MODAL: Review Applicants per company */}
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
