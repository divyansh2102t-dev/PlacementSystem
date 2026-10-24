"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Application, ApplicationStage } from "@/types";
import { StageBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { formatCurrencyLpa, formatDate } from "@/lib/utils";
import {
  Layers,
  Search,
  Check,
  X,
  ChevronRight,
  FileText,
  Filter,
} from "lucide-react";

export default function AdminApplicationsPage() {
  const { notify } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("All");

  const loadApps = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (Array.isArray(data)) setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleUpdateStatus = async (appId: number, stage: ApplicationStage) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, stage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify(data.message || `Candidate moved to ${stage}!`);
      loadApps();
    } catch (err: any) {
      notify(err.message || "Failed to update status", "error");
    }
  };

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase();
      const matchSearch =
        app.studentName.toLowerCase().includes(q) ||
        app.companyName.toLowerCase().includes(q) ||
        app.rollNo.toLowerCase().includes(q) ||
        app.roleTitle.toLowerCase().includes(q);

      const matchStage = selectedStage === "All" || app.stage === selectedStage;
      return matchSearch && matchStage;
    });
  }, [applications, search, selectedStage]);

  const stages: ApplicationStage[] = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Accepted",
    "Rejected",
  ];

  return (
    <DashboardLayout
      title="Application Pipeline & Candidate Tracking"
      subtitle="Comprehensive university-wide applicant review and status progression control"
    >
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, roll number, or company..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Stage:
            </span>
            {["All", ...stages].map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                  selectedStage === stage
                    ? "bg-[#252a27] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-300"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban Columns (Preserving stage tracking feature) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 items-start">
          {stages.map((stage) => {
            const stageApps = filtered.filter((a) => a.stage === stage);

            return (
              <div
                key={stage}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50 min-h-[220px]"
              >
                <div className="mb-2.5 flex items-center justify-between border-b pb-2 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {stage}
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.2 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {app.studentName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {app.rollNo} · {app.department} (CGPA {app.cgpa})
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          {formatCurrencyLpa(app.ctcLpa)}
                        </span>
                      </div>

                      <div className="mt-2 rounded bg-slate-50 p-1.5 text-[10px] dark:bg-slate-900/60">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {app.companyName}
                        </span>
                        <p className="text-slate-400 truncate">{app.roleTitle}</p>
                      </div>

                      {app.remarks && (
                        <p className="mt-1 text-[9px] text-slate-500 italic line-clamp-1">
                          "{app.remarks}"
                        </p>
                      )}

                      {/* Stage Progression Buttons */}
                      <div className="mt-2.5 flex items-center justify-between gap-1 border-t border-slate-100 pt-2 dark:border-slate-700/60 text-[10px]">
                        {stage !== "Accepted" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "Accepted")}
                            className="flex items-center gap-0.5 rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                          >
                            <Check size={10} /> Accept
                          </button>
                        )}
                        {stage !== "Rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "Rejected")}
                            className="flex items-center gap-0.5 rounded bg-rose-100 px-2 py-0.5 font-bold text-rose-800 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300"
                          >
                            <X size={10} /> Reject
                          </button>
                        )}
                        {stage === "Applied" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "Under Review")}
                            className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 ml-auto"
                          >
                            Review →
                          </button>
                        )}
                        {stage === "Under Review" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "Shortlisted")}
                            className="rounded bg-teal-100 px-2 py-0.5 text-teal-800 hover:bg-teal-200 dark:bg-teal-950 dark:text-teal-300 ml-auto"
                          >
                            Shortlist →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="py-8 text-center text-[10px] text-slate-400">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
