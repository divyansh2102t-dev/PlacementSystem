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
  const s = (stage || "").toLowerCase();
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200";

  if (s.includes("hire") || s.includes("accept") || s.includes("offer")) {
    colorClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
  } else if (s.includes("reject")) {
    colorClass = "bg-rose-100 text-rose-800 border-rose-300";
  } else if (s.includes("shortlist")) {
    colorClass = "bg-teal-100 text-teal-800 border-teal-300";
  } else if (s.includes("assess") || s.includes("test") || s.includes("coding")) {
    colorClass = "bg-indigo-100 text-indigo-800 border-indigo-300";
  } else if (s.includes("interview") || s.includes("round") || s.includes("discussion")) {
    colorClass = "bg-purple-100 text-purple-800 border-purple-300";
  } else if (s.includes("review") || s.includes("process")) {
    colorClass = "bg-amber-100 text-amber-800 border-amber-300";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${colorClass}`}
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
