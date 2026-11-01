"use client";

import React from "react";
import { Application, CompanyDrive, DEFAULT_COMPANY_STAGES } from "@/types";
import { StageBadge } from "@/components/ui/Badge";
import { formatCurrencyLpa, formatDate } from "@/lib/utils";
import {
  Building2,
  CheckCircle2,
  XCircle,
  MessageSquareQuote,
  ChevronRight,
  Award,
} from "lucide-react";

interface ApplicationsTimelineProps {
  applications: Application[];
  companies?: CompanyDrive[];
}

export function ApplicationsTimeline({ applications, companies = [] }: ApplicationsTimelineProps) {
  if (applications.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center border border-slate-200">
        <Building2 size={36} className="text-slate-300 mb-2" />
        <h3 className="text-sm font-bold text-slate-800">
          No Applications Yet
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Browse active campus recruitment drives and apply to eligible companies to track your recruitment milestones here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const isRejected = app.stage.toLowerCase().includes("reject");
        const isAccepted =
          app.stage.toLowerCase().includes("hired") ||
          app.stage.toLowerCase() === "accepted";

        // Find company-specific stages
        const matchedCompany = companies.find((c) => c.id === app.driveId);
        const stagesList =
          matchedCompany?.stages && matchedCompany.stages.length > 0
            ? [...matchedCompany.stages].sort((a, b) => a.order - b.order)
            : [...DEFAULT_COMPANY_STAGES];

        const stageNames = stagesList.map((s) => s.name);
        const currentStageIdx = stageNames.findIndex(
          (name) => name.toLowerCase() === (app.stage || "").toLowerCase()
        );
        const activeIdx = currentStageIdx !== -1 ? currentStageIdx : 0;
        const progressPct =
          stagesList.length > 1
            ? isAccepted
              ? 100
              : isRejected
              ? Math.max(10, Math.round(((activeIdx + 1) / stagesList.length) * 100))
              : Math.round(((activeIdx + 1) / stagesList.length) * 100)
            : 100;

        return (
          <div
            key={app.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm"
          >
            {/* Header: Company & CTC & Current Badge */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-800 border border-emerald-200/60">
                  {app.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {app.companyName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {app.roleTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-700">
                    {formatCurrencyLpa(app.ctcLpa)}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Applied: {formatDate(app.appliedDate)}
                  </p>
                </div>
                <StageBadge stage={app.stage} />
              </div>
            </div>

            {/* Dynamic Stage Progress Tracker */}
            <div className="mt-4 pt-1">
              <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
                {stagesList.map((stg, idx) => {
                  const isPassed = !isRejected && (activeIdx > idx || isAccepted);
                  const isCurrent = !isRejected && !isAccepted && activeIdx === idx;
                  const isFailedHere = isRejected && activeIdx === idx;

                  return (
                    <div
                      key={stg.id || idx}
                      className={`flex flex-col items-center flex-1 relative ${
                        isCurrent
                          ? "font-bold text-emerald-700"
                          : isPassed || isAccepted
                          ? "text-slate-800"
                          : isFailedHere
                          ? "text-rose-600 font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {/* Step Indicator Dot */}
                      <div
                        className={`grid h-6 w-6 place-items-center rounded-full text-[10px] mb-1 transition ${
                          isPassed || (isAccepted && idx === stagesList.length - 1)
                            ? "bg-emerald-600 text-white font-bold"
                            : isCurrent
                            ? "border-2 border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                            : isFailedHere
                            ? "bg-rose-600 text-white font-bold"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {isPassed || isAccepted ? "✓" : isFailedHere ? "✕" : idx + 1}
                      </div>
                      <span className="text-[10px] text-center px-1 truncate max-w-[90px]">
                        {stg.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Connecting Progress Bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isRejected
                      ? "bg-rose-500"
                      : isAccepted
                      ? "bg-emerald-600"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Admin Remark / Feedback Section */}
            {app.remarks && (
              <div
                className={`mt-3.5 flex items-start gap-2.5 rounded-xl p-3 text-xs ${
                  isRejected
                    ? "bg-rose-50 text-rose-900 border border-rose-200"
                    : isAccepted
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-slate-50 text-slate-700 border border-slate-200"
                }`}
              >
                {isRejected ? (
                  <XCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                ) : isAccepted ? (
                  <Award size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <MessageSquareQuote size={15} className="text-slate-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <span className="font-bold text-[10px] uppercase tracking-wider opacity-75">
                    Recruiter / Placement Cell Feedback:
                  </span>
                  <p className="mt-0.5 text-xs leading-relaxed">{app.remarks}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
