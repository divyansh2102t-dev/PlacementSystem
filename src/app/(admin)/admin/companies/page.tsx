"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CompanyVerticalCard } from "@/components/student/CompanyVerticalCard";
import { AdminCompanyModal } from "@/components/admin/AdminCompanyModal";
import { AdminCompanyApplicantsModal } from "@/components/admin/AdminCompanyApplicantsModal";
import { CompanyDetailModal } from "@/components/student/CompanyDetailModal";
import { Modal } from "@/components/ui/Modal";
import { CompanyDrive, Application, ApplicationStage, StudentDepartment } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { downloadCsv } from "@/lib/utils";
import {
  Building2,
  Search,
  Plus,
  Upload,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminCompaniesPage() {
  const { notify } = useToast();
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals
  const [companyToEdit, setCompanyToEdit] = useState<CompanyDrive | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyForApplicants, setCompanyForApplicants] = useState<CompanyDrive | null>(null);
  const [companyForDetail, setCompanyForDetail] = useState<CompanyDrive | null>(null);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [csvText, setCsvText] = useState("");

  const loadData = async () => {
    try {
      const [resC, resA] = await Promise.all([
        fetch("/api/companies").then((r) => r.json()),
        fetch("/api/applications").then((r) => r.json()),
      ]);

      if (Array.isArray(resC)) setCompanies(resC);
      if (Array.isArray(resA)) setApplications(resA);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

      notify(data.message || "Company drive saved!");
      loadData();
    } catch (err: any) {
      notify(err.message || "Failed to save company", "error");
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

      notify("Company drive deleted.");
      loadData();
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
      loadData();
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

      notify(data.message || `Bulk updated ${data.count} candidates!`);
      loadData();
    } catch (err: any) {
      notify(err.message || "Bulk update failed", "error");
    }
  };

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) {
        throw new Error("CSV requires a header row and at least one company row.");
      }
      const headers = lines[0].split(",").map((h) => h.trim());
      const records = lines.slice(1).map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = parts[i] || "";
        });
        return obj;
      });

      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(records),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify(data.message || "Imported company drives successfully!");
      setIsCsvImportOpen(false);
      setCsvText("");
      loadData();
    } catch (err: any) {
      notify(err.message || "CSV parse or import failed", "error");
    }
  };

  // Filter companies
  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        c.companyName.toLowerCase().includes(q) ||
        c.roleTitle.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);

      const matchTier = selectedTier === "All" || c.tier === selectedTier;
      const matchDept =
        selectedDept === "All" ||
        c.eligibleDepts.includes(selectedDept as StudentDepartment);

      return matchSearch && matchTier && matchDept;
    });
  }, [companies, search, selectedTier, selectedDept]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DashboardLayout
      title="Company Recruitment Drives & Criteria Management"
      subtitle="Vertical stack directory of registered recruiters, applicant reviews, and criteria control"
    >
      <div className="space-y-4">
        {/* Toolbar: Search, Filters & Import/Export */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800 space-y-3">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                size={14}
                className="absolute left-3 top-3 text-slate-400 pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by company name, role, or location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  downloadCsv("placehub-companies-export.csv", filtered)
                }
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Download size={13} /> Export CSV
              </button>
              <button
                onClick={() => setIsCsvImportOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Upload size={13} /> Import CSV
              </button>
              <button
                onClick={() => {
                  setCompanyToEdit(null);
                  setIsCompanyModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition"
              >
                <Plus size={14} /> Add Company Drive
              </button>
            </div>
          </div>

          {/* Secondary Tier & Branch Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                Tier:
              </span>
              {["All", "Super Dream", "Dream", "Core", "Mass Recruiter"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    setSelectedTier(tier);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    selectedTier === tier
                      ? "bg-[#252a27] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-300"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Department:
              </span>
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vertical Stack Company Cards (Requirement 3 & 5) */}
        <div className="space-y-3">
          {paginated.map((company) => (
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

          {paginated.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No company drives match your search query.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-xs dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-xs">
            <span className="text-slate-500 text-[11px]">
              Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> –{" "}
              <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> of{" "}
              <strong>{filtered.length}</strong> companies
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="px-2 font-bold text-slate-800 dark:text-slate-200">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
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

      {/* MODAL: CSV Import Companies */}
      <Modal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
        title="Import Recruitment Drives from CSV"
        subtitle="Bulk create corporate hiring drives with eligibility criteria"
        icon={<Upload size={18} />}
        maxWidth="lg"
      >
        <form onSubmit={handleCsvImport} className="space-y-3 text-xs">
          <p className="text-slate-500 leading-relaxed">
            Paste CSV formatted content with header: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">companyName,industry,roleTitle,ctcLpa,minCgpa,maxBacklogs,deadline</code>
          </p>

          <textarea
            rows={6}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`companyName,industry,roleTitle,ctcLpa,minCgpa,maxBacklogs,deadline\nQualcomm,Hardware,ASIC Design Engineer,18.0,7.5,0,2026-12-18\nAdobe India,Cloud,Software Engineer,25.0,8.0,0,2026-12-20`}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs dark:border-slate-700 dark:bg-slate-900"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCsvImportOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
            >
              Import Drives
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
