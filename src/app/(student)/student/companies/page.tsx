"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CompanyVerticalCard } from "@/components/student/CompanyVerticalCard";
import { ApplyModal } from "@/components/student/ApplyModal";
import { CompanyDetailModal } from "@/components/student/CompanyDetailModal";
import { CompanyCardSkeleton } from "@/components/ui/Skeleton";
import { CompanyDrive, Student, Application, CompanyTier, StudentDepartment } from "@/types";
import { getClientUser } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import { checkEligibility } from "@/lib/eligibility";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function StudentCompaniesPage() {
  const { notify } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedCompanyForApply, setSelectedCompanyForApply] = useState<CompanyDrive | null>(null);
  const [selectedCompanyForDetail, setSelectedCompanyForDetail] = useState<CompanyDrive | null>(null);

  const loadData = async () => {
    try {
      const activeUser = getClientUser();
      const studentId = activeUser?.studentId || 1;

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

      notify(data.message || "Application submitted successfully!");
      loadData();
    } catch (err: any) {
      notify(err.message || "Failed to submit application", "error");
    }
  };

  // Filtered companies list
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        c.companyName.toLowerCase().includes(q) ||
        c.roleTitle.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.requiredSkills?.some((s) => s.toLowerCase().includes(q));

      const matchTier = selectedTier === "All" || c.tier === selectedTier;
      const matchDept =
        selectedDept === "All" ||
        c.eligibleDepts.includes(selectedDept as StudentDepartment);

      const eligibility = student ? checkEligibility(student, c) : null;
      const matchEligible = !onlyEligible || (eligibility && eligibility.eligible);

      return matchSearch && matchTier && matchDept && matchEligible;
    });
  }, [companies, search, selectedTier, selectedDept, onlyEligible, student]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCompanies.length / pageSize) || 1;
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DashboardLayout
      title="Campus Recruitment Companies"
      subtitle="Full-width vertical stack directory of all campus hiring drives with live eligibility checks"
    >
      <div className="space-y-4">
        {/* Filtering & Search Toolbar */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={14}
                className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-200/80 bg-white/90 py-2.5 pl-9 pr-3 text-xs text-slate-800 shadow-2xs focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Eligible-Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2 shadow-2xs hover:border-emerald-300 transition">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => {
                  setOnlyEligible(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-700">
                Eligible Only For Me
              </span>
            </label>
          </div>

          {/* Secondary Filters: Tier & Department */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200/60 text-xs">
            {/* Tier filter pill buttons */}
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
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                    selectedTier === tier
                      ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs border border-transparent"
                      : "bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white hover:text-emerald-800 hover:border-emerald-300 shadow-2xs"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Department dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Branch:
              </span>
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="All">All Branches</option>
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

        {/* Vertical Stack Company Cards List (Requirement 3) */}
        {loading ? (
          <div className="space-y-3">
            <CompanyCardSkeleton />
            <CompanyCardSkeleton />
            <CompanyCardSkeleton />
          </div>
        ) : paginatedCompanies.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl bg-white/85 backdrop-blur-md p-8 text-center border border-slate-200/80 shadow-xs">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3 border border-slate-200/60">
              <Building2 size={28} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              No Companies Found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm leading-relaxed">
              Try adjusting your search criteria or unchecking "Eligible Only For Me".
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedTier("All");
                setSelectedDept("All");
                setOnlyEligible(false);
              }}
              className="mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-2 text-xs font-bold text-white hover:from-emerald-700 hover:to-teal-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedCompanies.map((company) => {
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-2xl bg-white/85 backdrop-blur-md p-3.5 shadow-xs border border-slate-200/80 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">
              Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> –{" "}
              <strong>
                {Math.min(currentPage * pageSize, filteredCompanies.length)}
              </strong>{" "}
              of <strong>{filteredCompanies.length}</strong> companies
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-40 transition shadow-2xs"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="px-2 font-bold text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-40 transition shadow-2xs"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
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
