"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { CompanyDrive, CompanyTier, StudentDepartment } from "@/types";
import { TierBadge } from "@/components/ui/Badge";
import { formatCurrencyLpa, formatStipend, formatDate } from "@/lib/utils";
import { getClientUser } from "@/lib/auth";
import {
  Building2,
  Search,
  Filter,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  GraduationCap,
  Briefcase,
  ChevronRight,
} from "lucide-react";

export default function PublicDrivesPage() {
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const user = getClientUser();
      if (user && user.role) setUserRole(user.role);
    } catch {}

    fetch("/api/companies")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCompanies(data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        c.companyName.toLowerCase().includes(q) ||
        c.roleTitle.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.requiredSkills?.some((s) => s.toLowerCase().includes(q));

      const matchTier = selectedTier === "All" || c.tier === selectedTier;
      const matchDept =
        selectedDept === "All" ||
        c.eligibleDepts.includes(selectedDept as StudentDepartment);

      return matchSearch && matchTier && matchDept;
    });
  }, [companies, search, selectedTier, selectedDept]);

  const applyLink = userRole
    ? userRole === "admin"
      ? "/admin/dashboard"
      : "/student/companies"
    : "/login";

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <PublicNavbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800 mb-3">
                  <Briefcase size={13} />
                  <span>2026-2027 Campus Hiring Season</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Recruitment Drives & Opportunities
                </h1>
                <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Browse verified campus hiring drives across Super Dream, Dream, and Core
                  tiers. Review compensation packages, eligibility benchmarks, and selection stages.
                </p>
              </div>

              {/* Action Banner */}
              <div className="flex items-center gap-3">
                <Link
                  href={applyLink}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-98 transition duration-150"
                >
                  <span>{userRole === "student" ? "Apply on Student Portal" : "Sign In to Apply"}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content & Filters */}
        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Filter Bar */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by company, role, skills, or city..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                {/* Branch selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Branch:
                  </span>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Engineering Branches</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
              </div>

              {/* Tier Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Tier Category:
                </span>
                {["All", "Super Dream", "Dream", "Core", "Mass Recruiter"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                      selectedTier === tier
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Drives List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <Building2 size={36} className="text-slate-400 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">No recruitment drives found</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Try adjusting your search criteria or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedTier("All");
                    setSelectedDept("All");
                  }}
                  className="mt-3 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((company) => (
                  <div
                    key={company.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:border-emerald-400/80 hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 font-extrabold text-emerald-800 text-sm shadow-2xs border border-emerald-200/80 group-hover:scale-105 transition-transform">
                            {company.companyName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                              {company.companyName}
                            </h3>
                            <span className="text-[11px] font-medium text-slate-500">
                              {company.industry} · {company.location}
                            </span>
                          </div>
                        </div>
                        <TierBadge tier={company.tier} />
                      </div>

                      {/* Role & Package */}
                      <div className="rounded-xl bg-slate-50 p-3 mb-3.5 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">{company.roleTitle}</span>
                          <span className="font-extrabold text-emerald-700 text-sm">
                            {formatCurrencyLpa(company.ctcLpa)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{company.roleType}</span>
                          <span>Stipend: {formatStipend(company.stipendMonthly)}</span>
                        </div>
                      </div>

                      {/* Criteria */}
                      <div className="space-y-1.5 text-[11px] text-slate-600 mb-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Min CGPA Required:</span>
                          <span className="font-bold text-slate-800">{company.minCgpa.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Backlogs Permitted:</span>
                          <span className="font-bold text-slate-800">
                            {company.maxBacklogs === 0 ? "0 (Zero Active)" : company.maxBacklogs}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Eligible Branches:</span>
                          <span className="font-semibold text-emerald-800 truncate max-w-[170px]">
                            {company.eligibleDepts.join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* Required Skills */}
                      {company.requiredSkills && company.requiredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {company.requiredSkills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                          {company.requiredSkills.length > 3 && (
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                              +{company.requiredSkills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Selection Stages preview */}
                      {company.stages && company.stages.length > 0 && (
                        <div className="border-t border-slate-100 pt-2.5 mb-3 text-[11px]">
                          <span className="text-slate-400 block mb-1 text-[10px] font-bold uppercase tracking-wider">
                            Selection Flow ({company.stages.length} Stages):
                          </span>
                          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] text-slate-600">
                            {company.stages.map((stg, idx) => (
                              <React.Fragment key={stg.id}>
                                <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-800">
                                  {stg.name}
                                </span>
                                {idx < company.stages!.length - 1 && (
                                  <ChevronRight size={10} className="text-slate-300 shrink-0" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock size={12} className="text-amber-500" />
                        Deadline: {formatDate(company.deadline)}
                      </span>
                      <Link
                        href={applyLink}
                        className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 transition group-hover:translate-x-0.5 duration-150"
                      >
                        <span>Apply</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

