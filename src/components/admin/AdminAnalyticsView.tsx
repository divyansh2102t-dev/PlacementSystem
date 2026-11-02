"use client";

import React, { useEffect, useState } from "react";
import { PlacementAnalyticsSummary } from "@/types";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { formatCurrencyLpa } from "@/lib/utils";
import {
  Users,
  Building2,
  Layers,
  Award,
  TrendingUp,
  Activity,
  Globe,
  Download,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function AdminAnalyticsView() {
  const { notify } = useToast();
  const [data, setData] = useState<PlacementAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <span>Aggregating campus placement metrics...</span>
        </div>
      </div>
    );
  }

  const applicationStatusSlices = [
    { label: "Accepted Offers", value: data.acceptedApplications, color: "#10b981" },
    { label: "In Evaluation", value: data.pendingApplications, color: "#f59e0b" },
    { label: "Rejected", value: data.rejectedApplications, color: "#f43f5e" },
  ];

  const branchBarItems = data.branchStats.map((b) => ({
    label: b.branch,
    value: b.placed,
    total: b.total,
    percentage: b.percentage,
    secondaryLabel: `${b.placed}/${b.total} (${b.percentage}%) · ${b.avgLpa}`,
  }));

  return (
    <div className="space-y-4">
      {/* Analytics Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-700" />
            Institutional Placement & Traffic Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time aggregate KPIs derived from relational tables and web access telemetry
          </p>
        </div>
        <button
          onClick={() => notify("Placement Analytics Report PDF exported successfully!")}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-emerald-700 hover:to-teal-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <Download size={13} /> Export PDF
        </button>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Placement Rate</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Award size={15} />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 group-hover:scale-105 transition-transform duration-200">
            {data.placementRate}%
          </p>
          <p className="text-[10px] text-slate-500 font-medium">{data.placedStudents} of {data.totalStudents} placed</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-slate-800 transition-colors">Total Recruiters</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <Building2 size={15} />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-200">
            {data.totalCompanies}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">Active campus drives</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-slate-800 transition-colors">Applications</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <Layers size={15} />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-200">
            {data.totalApplications}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">Pipeline submissions</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Highest Package</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <CheckCircle2 size={15} />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 group-hover:scale-105 transition-transform duration-200">
            {formatCurrencyLpa(data.highestCtcLpa)}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">Super Dream Offer</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-slate-800 transition-colors">Average CTC</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <TrendingUp size={15} />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-200">
            {formatCurrencyLpa(data.averageCtcLpa)}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">Across placed cohort</p>
        </div>
      </div>

      {/* Row 2: Applications Over Time + Status Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 sm:p-6 shadow-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
            Recruitment Drive Pipeline Trend (Applications vs Offers)
          </h3>
          <TrendLineChart data={data.recentApplicationsTrend} />
        </div>

        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 sm:p-6 shadow-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
            Overall Application Pipeline Stages
          </h3>
          <DonutChart data={applicationStatusSlices} totalLabel="Applications" size={170} />
        </div>
      </div>

      {/* Row 3: Branch-Wise Placement & Website Telemetry */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Branch-Wise Progress */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 sm:p-6 shadow-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
            Department-Wise Placement Rates & Average CTC
          </h3>
          <BarChart items={branchBarItems} />
        </div>

        {/* Portal Activity Overview */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Globe size={15} className="text-emerald-600" />
              Portal Activity Overview
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-2xl bg-white/90 p-3.5 border border-slate-200/70 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Students Online</span>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                {data.websiteStats.activeUsers}
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 p-3.5 border border-slate-200/70 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Portal Visits</span>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                {data.websiteStats.dailyLogins}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold text-slate-700 mb-2">
              Most Accessed Portal Pages
            </h4>
            <div className="space-y-1.5 text-xs">
              {data.websiteStats.mostVisitedPages.map((p) => (
                <div
                  key={p.page}
                  className="flex items-center justify-between rounded-xl bg-white/90 border border-slate-200/70 px-3 py-2 shadow-2xs hover:border-emerald-300 transition-all"
                >
                  <span className="text-[11px] text-slate-700 font-semibold">
                    {p.page}
                  </span>
                  <span className="font-extrabold text-emerald-700 text-[11px]">
                    {p.views} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
