"use client";

import React from "react";
import { Application, ApplicationStage } from "@/types";
import { StageBadge } from "@/components/ui/Badge";
import { formatCurrencyLpa, formatDate } from "@/lib/utils";
import {
  Clock,
  Building2,
  FileCheck2,
  MessageSquareQuote,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface ApplicationsTimelineProps {
  applications: Application[];
}

export function ApplicationsTimeline({ applications }: ApplicationsTimelineProps) {
  if (applications.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800">
        <Building2 size={36} className="text-slate-400 mb-2" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          No Applications Yet
        </h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          Browse upcoming campus recruitment drives and apply to eligible companies to track your recruitment milestones here.
        </p>
      </div>
    );
  }

  const stagesInOrder: ApplicationStage[] = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Accepted",
  ];

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const isRejected = app.stage === "Rejected";
        const isAccepted = app.stage === "Accepted";

        return (
          <div
            key={app.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90 transition hover:shadow-sm"
          >
            {/* Header: Company & CTC & Current Badge */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                  {app.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {app.companyName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {app.roleTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                    {formatCurrencyLpa(app.ctcLpa)}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Applied: {formatDate(app.appliedDate)}
                  </p>
                </div>
                <StageBadge stage={app.stage} />
              </div>
            </div>

            {/* Stage Progress Tracker */}
            <div className="mt-4 pt-1">
              <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
                {stagesInOrder.map((step, idx) => {
                  const stepIndex = stagesInOrder.indexOf(app.stage);
                  const isPassed = !isRejected && stepIndex >= idx;
                  const isCurrent = app.stage === step;

                  return (
                    <div
                      key={step}
                      className={`flex flex-col items-center flex-1 relative ${
                        isCurrent
                          ? "font-bold text-emerald-700 dark:text-emerald-400"
                          : isPassed
                          ? "text-slate-700 dark:text-slate-300"
                          : "text-slate-400"
                      }`}
                    >
                      {/* Step Indicator Dot */}
                      <div
                        className={`grid h-6 w-6 place-items-center rounded-full text-[10px] mb-1 transition ${
                          isPassed
                            ? "bg-emerald-600 text-white font-bold"
                            : isCurrent
                            ? "border-2 border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-700"
                        }`}
                      >
                        {isPassed ? "✓" : idx + 1}
                      </div>
                      <span className="text-[10px] text-center">{step}</span>
                    </div>
                  );
                })}
              </div>

              {/* Connecting Progress Bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isRejected
                      ? "bg-rose-500"
                      : isAccepted
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-emerald-500 to-teal-400"
                  }`}
                  style={{
                    width: isRejected
                      ? "100%"
                      : isAccepted
                      ? "100%"
                      : app.stage === "Shortlisted"
                      ? "75%"
                      : app.stage === "Under Review"
                      ? "50%"
                      : "25%",
                  }}
                />
              </div>
            </div>

            {/* Admin Remark / Feedback Section */}
            {app.remarks && (
              <div
                className={`mt-3.5 flex items-start gap-2.5 rounded-xl p-3 text-xs ${
                  isRejected
                    ? "bg-rose-50 text-rose-900 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900/60"
                    : isAccepted
                    ? "bg-emerald-50 text-emerald-950 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900/60"
                    : "bg-slate-50 text-slate-700 border border-slate-200/60 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800"
                }`}
              >
                {isRejected ? (
                  <XCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                ) : isAccepted ? (
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <MessageSquareQuote size={15} className="text-slate-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <span className="font-bold text-[10px] uppercase tracking-wider opacity-75">
                    Placement Cell Note:
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
