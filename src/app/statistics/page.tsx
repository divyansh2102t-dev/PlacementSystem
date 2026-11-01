"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { HeadlineStatsConfig, DEFAULT_HEADLINE_STATS } from "@/types";
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Building2,
  DollarSign,
  Briefcase,
  GraduationCap,
  ArrowRight,
  PieChart,
  CheckCircle2,
} from "lucide-react";

export default function PublicStatisticsPage() {
  const [headlineStats, setHeadlineStats] = useState<HeadlineStatsConfig>(DEFAULT_HEADLINE_STATS);

  useEffect(() => {
    fetch("/api/headline-stats")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.highestPackage) setHeadlineStats(data);
      })
      .catch(() => {});
  }, []);

  const branchStats = [
    { name: "Computer Science & Engineering", code: "CSE", rate: 94.8, highest: "₹45.0 LPA", avg: "₹16.8 LPA", offers: 142 },
    { name: "Information Technology", code: "IT", rate: 91.2, highest: "₹38.0 LPA", avg: "₹15.2 LPA", offers: 88 },
    { name: "Electronics & Communication", code: "ECE", rate: 83.5, highest: "₹26.5 LPA", avg: "₹11.4 LPA", offers: 64 },
    { name: "Electrical & Electronics", code: "EEE", rate: 78.0, highest: "₹20.0 LPA", avg: "₹9.8 LPA", offers: 32 },
    { name: "Mechanical Engineering", code: "MECH", rate: 72.4, highest: "₹14.5 LPA", avg: "₹8.2 LPA", offers: 14 },
    { name: "Civil Engineering", code: "CIVIL", rate: 68.0, highest: "₹11.0 LPA", avg: "₹7.5 LPA", offers: 8 },
  ];

  const sectorDistribution = [
    { sector: "Enterprise Software & Cloud Platforms", percentage: 38, color: "bg-emerald-600" },
    { sector: "FinTech, Quantitative Trading & Banking", percentage: 24, color: "bg-teal-600" },
    { sector: "Product Strategy & Management Consulting", percentage: 18, color: "bg-blue-600" },
    { sector: "Core Engineering, Robotics & Automotive", percentage: 12, color: "bg-amber-600" },
    { sector: "Healthcare Technology & Emerging Tech", percentage: 8, color: "bg-indigo-600" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <PublicNavbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800 mb-4">
                <BarChart3 size={13} />
                <span>Verified Placement Record 2026-2027</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Placement Insights & Analytics
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Explore comprehensive statistics covering institutional salary benchmarks, branch-wise
                selection ratios, and hiring sector distributions across participating corporate partners.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Primary KPI Cards */}
        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {headlineStats.highestPackage?.label || "HIGHEST PACKAGE"}
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                  {headlineStats.highestPackage?.value || "₹45.0 LPA"}
                </p>
                <span className="mt-1 block text-xs text-slate-500">
                  {headlineStats.highestPackage?.subtext || "Super Dream Tier"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {headlineStats.averageCtc?.label || "AVERAGE CTC"}
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {headlineStats.averageCtc?.value || "₹14.2 LPA"}
                </p>
                <span className="mt-1 block text-xs text-slate-500">
                  {headlineStats.averageCtc?.subtext || "All Engineering Branches"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {headlineStats.placementRate?.label || "PLACEMENT RATE"}
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                  {headlineStats.placementRate?.value || "86.4%"}
                </p>
                <span className="mt-1 block text-xs text-slate-500">
                  {headlineStats.placementRate?.subtext || "2026 Graduating Cohort"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {headlineStats.recruitingPartners?.label || "RECRUITING PARTNERS"}
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {headlineStats.recruitingPartners?.value || "120+"}
                </p>
                <span className="mt-1 block text-xs text-slate-500">
                  {headlineStats.recruitingPartners?.subtext || "Global Tech & Enterprise"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Branch-wise breakdown */}
        <section className="py-8 md:py-12 border-t border-slate-200/80 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Department Performance
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Branch-Wise Placement Breakdown
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Analysis of placement percentages, average salary offerings, and highest package across engineering disciplines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {branchStats.map((branch) => (
                <div
                  key={branch.code}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      {branch.code}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      {branch.rate}% Placed
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    {branch.name}
                  </h3>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${branch.rate}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-slate-200/70 pt-3 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Highest</span>
                      <strong className="text-slate-900">{branch.highest}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Average</span>
                      <strong className="text-slate-900">{branch.avg}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Offers</span>
                      <strong className="text-slate-900">{branch.offers}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sectoral Spread */}
        <section className="py-8 md:py-12 border-t border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Corporate Diversity
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Industry & Sectoral Distribution
                </h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Our graduating cohorts receive versatile opportunities across tier-1 software giants, quantitative investment funds, research laboratories, and management consulting firms.
                </p>

                <div className="mt-6 space-y-4">
                  {sectorDistribution.map((item) => (
                    <div key={item.sector} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{item.sector}</span>
                        <span className="font-bold text-slate-900">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`${item.color} h-2.5 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier Distribution card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-2xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  CTC Tier Classification Framework
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Institutional classification governs student eligibility, dream upgrades, and one-offer rules:
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-start gap-3 rounded-xl bg-purple-50 p-3 border border-purple-100">
                    <span className="font-bold text-purple-700 shrink-0 w-24">Super Dream:</span>
                    <span className="text-slate-600">Packages ≥ ₹18.0 LPA with high-impact engineering or research roles.</span>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3 border border-emerald-100">
                    <span className="font-bold text-emerald-700 shrink-0 w-24">Dream Tier:</span>
                    <span className="text-slate-600">Packages between ₹10.0 LPA and ₹18.0 LPA in enterprise technology and consulting.</span>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 border border-blue-100">
                    <span className="font-bold text-blue-700 shrink-0 w-24">Core Tier:</span>
                    <span className="text-slate-600">Packages between ₹6.0 LPA and ₹10.0 LPA in specialized core engineering.</span>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200">
                    <span className="font-bold text-slate-700 shrink-0 w-24">Mass Recruiter:</span>
                    <span className="text-slate-600">High-volume recruitment drives below ₹6.0 LPA with broad branch eligibility.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

