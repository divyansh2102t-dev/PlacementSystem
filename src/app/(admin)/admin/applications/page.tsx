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

  const stages = useMemo(() => {
    const list = ["Applied", "Shortlisting", "Online Assessment", "Technical Interview", "Hired", "Rejected"];
    const set = new Set(list);
    applications.forEach((a) => {
      if (a.stage) set.add(a.stage);
    });
    return Array.from(set);
  }, [applications]);

  return (
    <DashboardLayout
      title="Application Pipeline & Candidate Tracking"
      subtitle="Comprehensive candidate evaluations, stage advances, and offer issuances"
    >
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 sm:p-6 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white/90 py-2.5 pl-9 pr-3 text-xs text-slate-800 shadow-2xs focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
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
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  selectedStage === stage
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs border border-transparent"
                    : "bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white hover:text-emerald-800 hover:border-emerald-300 shadow-2xs"
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
                className="rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-3.5 shadow-2xs min-h-[220px]"
              >
                <div className="mb-3 flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                  <span className="text-xs font-extrabold text-slate-900">
                    {stage}
                  </span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-2xs hover:border-emerald-300 hover:shadow-xs hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">
                            {app.studentName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {app.rollNo} · {app.department} (CGPA {app.cgpa})
                          </p>
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-700">
                          {formatCurrencyLpa(app.ctcLpa)}
                        </span>
                      </div>

                      <div className="mt-2 rounded-xl bg-slate-50/80 border border-slate-100 p-2 text-[10px]">
                        <span className="font-bold text-slate-800">
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
                      <div className="mt-2.5 flex items-center justify-between gap-1 border-t border-slate-100 pt-2 text-[10px]">
                        {stage !== "Accepted" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "Accepted")}
                            className="flex items-center gap-0.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-2 py-1 font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition"
                          >
                            <Check size={10} /> Accept
                          </button>
                        )}
                        {stage !== "Rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "Rejected")}
                            className="flex items-center gap-0.5 rounded-lg bg-rose-50 border border-rose-200/60 px-2 py-1 font-bold text-rose-800 hover:bg-rose-600 hover:text-white transition"
                          >
                            <X size={10} /> Reject
                          </button>
                        )}
                        {stage === "Applied" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "Under Review")}
                            className="rounded-lg bg-slate-100 px-2 py-1 font-bold text-slate-700 hover:bg-slate-200 ml-auto transition"
                          >
                            Review →
                          </button>
                        )}
                        {stage === "Under Review" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "Shortlisted")}
                            className="rounded-lg bg-teal-50 border border-teal-200/60 px-2 py-1 font-bold text-teal-800 hover:bg-teal-600 hover:text-white ml-auto transition"
                          >
                            Shortlist →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="py-8 text-center text-[10px] text-slate-400 font-medium">
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
