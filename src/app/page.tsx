"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { getClientUser, AUTH_CHANGE_EVENT } from "@/lib/auth";
import { User, CompanyDrive, HeadlineStatsConfig, DEFAULT_HEADLINE_STATS } from "@/types";
import { TierBadge } from "@/components/ui/Badge";
import { formatCurrencyLpa, formatDate } from "@/lib/utils";
import {
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Layers,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  BarChart3,
  Terminal,
  FileCheck2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [headlineStats, setHeadlineStats] = useState<HeadlineStatsConfig>(DEFAULT_HEADLINE_STATS);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const user = getClientUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };

    syncAuth();
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);

    // Fetch active companies
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCompanies(data.slice(0, 3));
      })
      .catch(() => {});

    // Fetch live headline stats managed by admin
    fetch("/api/headline-stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.highestPackage) setHeadlineStats(data);
      })
      .catch(() => {});

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const dashboardHref =
    currentUser?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <PublicNavbar />

      <main className="flex-1">
        {/* =========================================================================
            HERO SECTION
        ========================================================================== */}
        <section className="relative overflow-hidden border-b border-slate-200/80 py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Season Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>2026-2027 Campus Recruitment Season Active</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                Accelerate Your Career With{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  Campus Placements
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                The centralized university portal for automated academic eligibility,
                multi-stage recruitment pipelines, transparent shortlisting, and verified
                corporate job offers.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {currentUser ? (
                  <Link
                    href={dashboardHref}
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:from-emerald-700 hover:to-teal-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <span>Launch My Dashboard</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:from-emerald-700 hover:to-teal-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                      <span>Student Registration</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-xl border border-slate-300 bg-white/90 px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:border-emerald-400 hover:text-emerald-700 hover:bg-white hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 shadow-2xs transition-all duration-200"
                    >
                      Log In to Portal
                    </Link>
                  </>
                )}
                <Link
                  href="/drives"
                  className="group flex items-center gap-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50/80 px-5 py-3 text-xs sm:text-sm font-bold text-emerald-900 hover:bg-emerald-100/90 hover:border-emerald-400 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <Briefcase size={15} className="group-hover:scale-110 transition-transform" />
                  <span>Explore Open Drives</span>
                </Link>
              </div>

              {/* Trust Micro-Badges */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  Real-Time Eligibility Check
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Custom Company Stages
                </span>
                <span className="flex items-center gap-1.5">
                  <Award size={16} className="text-emerald-600" />
                  Verified Placed Records
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            STATS STRIP (Managed directly from Admin Panel - Matches Screenshot)
        ========================================================================== */}
        <section className="border-y border-slate-200/80 bg-white/95 backdrop-blur-md py-9 sm:py-12 shadow-2xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* Metric 1: Highest Package */}
              <div className="group pt-4 lg:pt-0 px-4 space-y-1.5 transition-transform duration-200 hover:-translate-y-1 cursor-default">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700 transition-colors block">
                  {headlineStats.highestPackage?.label || "HIGHEST PACKAGE"}
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700 tracking-tight group-hover:scale-105 transition-transform duration-200">
                  {headlineStats.highestPackage?.value || "₹45.0 LPA"}
                </p>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                  {headlineStats.highestPackage?.subtext || "Super Dream Tier"}
                </span>
              </div>

              {/* Metric 2: Average CTC */}
              <div className="group pt-4 lg:pt-0 px-4 space-y-1.5 transition-transform duration-200 hover:-translate-y-1 cursor-default">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-800 transition-colors block">
                  {headlineStats.averageCtc?.label || "AVERAGE CTC"}
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight group-hover:scale-105 transition-transform duration-200">
                  {headlineStats.averageCtc?.value || "₹14.2 LPA"}
                </p>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                  {headlineStats.averageCtc?.subtext || "All Engineering Branches"}
                </span>
              </div>

              {/* Metric 3: Placement Rate */}
              <div className="group pt-4 lg:pt-0 px-4 space-y-1.5 transition-transform duration-200 hover:-translate-y-1 cursor-default">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700 transition-colors block">
                  {headlineStats.placementRate?.label || "PLACEMENT RATE"}
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700 tracking-tight group-hover:scale-105 transition-transform duration-200">
                  {headlineStats.placementRate?.value || "86.4%"}
                </p>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                  {headlineStats.placementRate?.subtext || "2026 Graduating Cohort"}
                </span>
              </div>

              {/* Metric 4: Recruiting Partners */}
              <div className="group pt-4 lg:pt-0 px-4 space-y-1.5 transition-transform duration-200 hover:-translate-y-1 cursor-default">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-800 transition-colors block">
                  {headlineStats.recruitingPartners?.label || "RECRUITING PARTNERS"}
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight group-hover:scale-105 transition-transform duration-200">
                  {headlineStats.recruitingPartners?.value || "120+"}
                </p>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                  {headlineStats.recruitingPartners?.subtext || "Global Tech & Enterprise"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FEATURED ACTIVE DRIVES
        ========================================================================== */}
        <section className="py-14 sm:py-18">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  On-Campus Opportunities
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Active Recruitment Drives
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
                  Premier organizations currently conducting on-campus evaluations and interview rounds.
                </p>
              </div>
              <Link
                href="/drives"
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition group"
              >
                <span>View All Drives & Filter by Branch</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-6 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 font-extrabold text-emerald-800 text-sm shadow-2xs border border-emerald-200/80">
                          {company.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {company.companyName}
                          </h3>
                          <span className="text-[11px] text-slate-500">
                            {company.industry} · {company.location}
                          </span>
                        </div>
                      </div>
                      <TierBadge tier={company.tier} />
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 mb-3.5 space-y-1 border border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{company.roleTitle}</span>
                        <span className="font-extrabold text-emerald-700 text-sm">
                          {formatCurrencyLpa(company.ctcLpa)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        Min CGPA: {company.minCgpa.toFixed(2)} · Backlogs: {company.maxBacklogs}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {company.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock size={12} className="text-amber-500" />
                      {formatDate(company.deadline)}
                    </span>
                    <Link
                      href="/drives"
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      Explore Drive →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            HIRING PIPELINE PREVIEW
        ========================================================================== */}
        <section className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-14 sm:py-18">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Transparent Multi-Stage Flow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                How Campus Hiring Works
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Every company drive features custom recruitment rounds. Only students who qualify
                advance to the next evaluation stage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:border-emerald-300 transition">
                <span className="font-mono text-2xl font-black text-emerald-600">01</span>
                <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1">
                  Automated Eligibility
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The portal validates CGPA, active backlogs, and engineering departments against company criteria.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:border-emerald-300 transition">
                <span className="font-mono text-2xl font-black text-emerald-600">02</span>
                <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1">
                  Online Assessments
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Proctored coding and cognitive assessments with instant score validation and shortlisting.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:border-emerald-300 transition">
                <span className="font-mono text-2xl font-black text-emerald-600">03</span>
                <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1">
                  Technical Interviews
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multi-round technical depth evaluations covering algorithms, systems, and engineering fundamentals.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:border-emerald-300 transition">
                <span className="font-mono text-2xl font-black text-emerald-600">04</span>
                <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1">
                  Offer Confirmation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Final Letter of Intent issued. Real-time status update to Placed with verified CTC records.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/pipeline"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
              >
                <span>Read Full Pipeline & Custom Stages Guide</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BOTTOM CALL TO ACTION
        ========================================================================== */}
        <section className="py-14 sm:py-18 bg-slate-900 text-white relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Start Your Placement Journey Today
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Sign up for student access, review your live eligibility across top tier companies,
              and stay synchronized with every interview round.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-sm hover:bg-emerald-400 transition"
              >
                Create Student Account
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
              >
                Staff & Admin Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
