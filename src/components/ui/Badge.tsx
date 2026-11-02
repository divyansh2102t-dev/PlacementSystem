import React from "react";
import { CompanyTier, ApplicationStage } from "@/types";

export function TierBadge({ tier }: { tier: CompanyTier }) {
  const styles: Record<CompanyTier, string> = {
    "Super Dream":
      "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs font-extrabold",
    Dream:
      "bg-teal-50 text-teal-800 border-teal-300 shadow-2xs font-bold",
    Core: "bg-blue-50 text-blue-800 border-blue-300 shadow-2xs font-bold",
    "Mass Recruiter":
      "bg-slate-50 text-slate-700 border-slate-300 shadow-2xs font-bold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-wider ${
        styles[tier] || styles["Dream"]
      }`}
    >
      {tier}
    </span>
  );
}

export function StageBadge({ stage }: { stage: ApplicationStage }) {
  const s = (stage || "").toLowerCase();
  let colorClass = "bg-slate-50 text-slate-700 border-slate-200";

  if (s.includes("hire") || s.includes("accept") || s.includes("offer")) {
    colorClass = "bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold shadow-2xs";
  } else if (s.includes("reject")) {
    colorClass = "bg-rose-50 text-rose-800 border-rose-200 font-extrabold shadow-2xs";
  } else if (s.includes("shortlist")) {
    colorClass = "bg-teal-50 text-teal-800 border-teal-300 font-bold shadow-2xs";
  } else if (s.includes("assess") || s.includes("test") || s.includes("coding")) {
    colorClass = "bg-indigo-50 text-indigo-800 border-indigo-200 font-bold shadow-2xs";
  } else if (s.includes("interview") || s.includes("round") || s.includes("discussion")) {
    colorClass = "bg-purple-50 text-purple-800 border-purple-200 font-bold shadow-2xs";
  } else if (s.includes("review") || s.includes("process")) {
    colorClass = "bg-amber-50 text-amber-800 border-amber-200 font-bold shadow-2xs";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] ${colorClass}`}
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
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 shadow-2xs">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Applied
      </span>
    );
  }

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
        Expired
      </span>
    );
  }

  if (eligible) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 shadow-2xs">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Eligible to Apply
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
      Not Eligible
    </span>
  );
}
