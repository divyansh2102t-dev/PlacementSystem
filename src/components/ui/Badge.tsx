import React from "react";
import { CompanyTier, ApplicationStage } from "@/types";

export function TierBadge({ tier }: { tier: CompanyTier }) {
  const styles: Record<CompanyTier, string> = {
    "Super Dream":
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/40",
    Dream:
      "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300/40",
    Core: "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300/40",
    "Mass Recruiter":
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300/40",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
        styles[tier] || styles["Dream"]
      }`}
    >
      {tier}
    </span>
  );
}

export function StageBadge({ stage }: { stage: ApplicationStage }) {
  const styles: Record<ApplicationStage, string> = {
    Applied: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    "Under Review": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    Shortlisted: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
    "Online Assessment": "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
    "Technical Interview": "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    "HR Round": "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
    Accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    Rejected: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
        styles[stage] || styles["Applied"]
      }`}
    >
      {stage}
    </span>
  );
}

export function EligibilityBadge({
  eligible,
  isApplied,
  isExpired,
}: {
  eligible: boolean;
  isApplied?: boolean;
  isExpired?: boolean;
}) {
  if (isApplied) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Applied
      </span>
    );
  }

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        Expired
      </span>
    );
  }

  if (eligible) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Eligible to Apply
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
      Not Eligible
    </span>
  );
}
