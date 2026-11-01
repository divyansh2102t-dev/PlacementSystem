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
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-700 dark:text-emerald-400" />
            Institutional Placement & Traffic Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time aggregate KPIs derived from relational tables and web access telemetry
          </p>
        </div>
        <button
          onClick={() => notify("Placement Analytics Report PDF exported successfully!")}
          className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition"
        >
          <Download size={13} /> Export PDF
        </button>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Placement Rate</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              <Award size={15} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {data.placementRate}%
          </p>
          <p className="text-[9px] text-slate-400">{data.placedStudents} of {data.totalStudents} placed</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Recruiters</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              <Building2 size={15} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {data.totalCompanies}
          </p>
          <p className="text-[9px] text-slate-400">Active campus drives</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Applications</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              <Layers size={15} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {data.totalApplications}
          </p>
          <p className="text-[9px] text-slate-400">Pipeline submissions</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Highest Package</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={15} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrencyLpa(data.highestCtcLpa)}
          </p>
          <p className="text-[9px] text-slate-400">Super Dream Offer</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average CTC</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              <TrendingUp size={15} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrencyLpa(data.averageCtcLpa)}
          </p>
          <p className="text-[9px] text-slate-400">Across placed cohort</p>
        </div>
      </div>

      {/* Row 2: Applications Over Time + Status Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Recruitment Drive Pipeline Trend (Applications vs Offers)
          </h3>
          <TrendLineChart data={data.recentApplicationsTrend} />
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Overall Application Pipeline Stages
          </h3>
          <DonutChart data={applicationStatusSlices} totalLabel="Applications" size={170} />
        </div>
      </div>

      {/* Row 3: Branch-Wise Placement & Website Telemetry */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Branch-Wise Progress */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Department-Wise Placement Rates & Average CTC
          </h3>
          <BarChart items={branchBarItems} />
        </div>

        {/* Website Web Traffic & Activity Analytics (Requirement 5) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Globe size={14} className="text-emerald-600" />
              Website & Portal Telemetry
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Online
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400">Active Concurrent Users</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                {data.websiteStats.activeUsers}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400">Daily Student Logins</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                {data.websiteStats.dailyLogins}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">
              Most Visited Portal Routes
            </h4>
            <div className="space-y-1.5 text-xs">
              {data.websiteStats.mostVisitedPages.map((p) => (
                <div
                  key={p.page}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 dark:bg-slate-900/40"
                >
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    {p.page}
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
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
