"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ApplicationsTimeline } from "@/components/student/ApplicationsTimeline";
import { Application, CompanyDrive } from "@/types";
import { getClientUser } from "@/lib/auth";
import { Layers, RefreshCw } from "lucide-react";

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const activeUser = getClientUser();
      const studentId = activeUser?.studentId || 1;

      const [resApps, resCompanies] = await Promise.all([
        fetch(`/api/applications?studentId=${studentId}`).then((r) => r.json()),
        fetch("/api/companies").then((r) => r.json()),
      ]);

      if (Array.isArray(resApps)) setApplications(resApps);
      if (Array.isArray(resCompanies)) setCompanies(resCompanies);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardLayout
      title="My Campus Applications"
      subtitle="Track your stage progress, milestone history, and remarks from the recruitment cell"
    >
      <div className="space-y-4">
        {/* Header toolbar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers size={16} className="text-emerald-700" />
              Application Milestones & Status Timeline
            </h2>
            <p className="text-xs text-slate-500">
              Live updates sync automatically whenever an administrator or recruiter updates your round
            </p>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Timeline list */}
        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              <span>Fetching your application records...</span>
            </div>
          </div>
        ) : (
          <ApplicationsTimeline applications={applications} companies={companies} />
        )}
      </div>
    </DashboardLayout>
  );
}
