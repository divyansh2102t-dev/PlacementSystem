"use client";

import React from "react";
import { Application, Student } from "@/types";
import { DonutChart } from "@/components/charts/DonutChart";
import { CheckCircle2, Clock, XCircle, Award, TrendingUp, ShieldCheck } from "lucide-react";

interface StudentAnalyticsProps {
  student: Student;
  applications: Application[];
}

export function StudentAnalytics({ student, applications }: StudentAnalyticsProps) {
  const totalApplied = applications.length;
  const accepted = applications.filter(
    (a) => a.stage === "Accepted" || a.stage.toLowerCase().includes("hired")
  ).length;
  const rejected = applications.filter((a) =>
    a.stage.toLowerCase().includes("reject")
  ).length;
  const pending = totalApplied - accepted - rejected;

  // Profile strength calculation
  let strengthScore = 40; // baseline
  if (student.cgpa >= 8.5) strengthScore += 25;
  else if (student.cgpa >= 7.5) strengthScore += 15;
  if (student.activeBacklogs === 0) strengthScore += 15;
  if (student.skills.length >= 4) strengthScore += 15;
  if (student.resumeUrl) strengthScore += 5;
  strengthScore = Math.min(100, strengthScore);

  const statusSlices = [
    { label: "Accepted", value: accepted, color: "#10b981" },
    { label: "Under Review / Process", value: pending, color: "#f59e0b" },
    { label: "Rejected", value: rejected, color: "#f43f5e" },
  ];

  return (
    <div className="space-y-4">
      {/* 4 KPI Top Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-slate-800 transition-colors">Total Applied</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <TrendingUp size={16} />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-200">
            {totalApplied}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Drives enrolled</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Accepted Offers</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 group-hover:scale-105 transition-transform duration-200">
            {accepted}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {accepted > 0 ? "Placement confirmed" : "Awaiting final decision"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-amber-700 transition-colors">In Process</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Clock size={16} />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 group-hover:scale-105 transition-transform duration-200">
            {pending}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Active evaluation rounds</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-4 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Profile Strength</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ShieldCheck size={16} />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-200">
            {strengthScore}%
          </p>
          <p className="text-[11px] text-emerald-700 font-bold">
            {strengthScore >= 80 ? "Top Quartile" : "Good Standing"}
          </p>
        </div>
      </div>

      {/* Main Grid: Status Breakdown + Profile Strength Meter */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Status Breakdown Donut Chart */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 sm:p-6 shadow-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4">
            Application Status Distribution
          </h3>
          {totalApplied > 0 ? (
            <DonutChart data={statusSlices} totalLabel="Applications" size={170} />
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No application submissions yet to analyze.
            </div>
          )}
        </div>

        {/* Profile Strength & Competitiveness Meter */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Recruiter Competitiveness Index
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Calculated automatically from your academic CGPA, verified active backlogs, and verified technical skill tags.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="font-bold text-slate-700">
                    Academic Index (CGPA {student.cgpa})
                  </span>
                  <strong className="text-emerald-700 font-extrabold">
                    {student.cgpa >= 8.5 ? "95%" : "75%"}
                  </strong>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${(student.cgpa / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="font-bold text-slate-700">
                    Backlog Standing ({student.activeBacklogs} Backlogs)
                  </span>
                  <strong
                    className={
                      student.activeBacklogs === 0
                        ? "text-emerald-700 font-extrabold"
                        : "text-amber-600 font-extrabold"
                    }
                  >
                    {student.activeBacklogs === 0 ? "100% Clean" : "Requires Clearance"}
                  </strong>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                  <div
                    className={`h-full rounded-full ${
                      student.activeBacklogs === 0
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                        : "bg-amber-500"
                    }`}
                    style={{ width: student.activeBacklogs === 0 ? "100%" : "60%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="font-bold text-slate-700">
                    Technical Stack Depth ({student.skills.length} Skills)
                  </span>
                  <strong className="text-emerald-700 font-extrabold">
                    {Math.min(student.skills.length * 20, 100)}%
                  </strong>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                    style={{ width: `${Math.min(student.skills.length * 20, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 p-3.5 text-xs text-emerald-950">
            <span className="font-extrabold flex items-center gap-1.5 text-emerald-900">
              <Award size={14} className="text-emerald-700" />
              Recommendation:
            </span>
            <p className="mt-1 leading-relaxed opacity-90">
              {student.cgpa >= 8.0
                ? "You are eligible for Tier 1 Super Dream packages (> ₹20 LPA). Focus on distributed systems and advanced algorithmic rounds."
                : "Target Core Engineering and Dream drives (10–18 LPA). Maintain clean backlogs to maximize interview conversion."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
