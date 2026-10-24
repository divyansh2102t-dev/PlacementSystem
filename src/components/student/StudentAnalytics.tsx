"use client";

import React from "react";
import { Application, Student } from "@/types";
import { DonutChart } from "@/components/charts/DonutChart";
import { CheckCircle2, Clock, XCircle, Award, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

interface StudentAnalyticsProps {
  student: Student;
  applications: Application[];
}

export function StudentAnalytics({ student, applications }: StudentAnalyticsProps) {
  const totalApplied = applications.length;
  const accepted = applications.filter((a) => a.stage === "Accepted").length;
  const rejected = applications.filter((a) => a.stage === "Rejected").length;
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
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Applied</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              <TrendingUp size={16} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {totalApplied}
          </p>
          <p className="text-[10px] text-slate-400">Drives enrolled</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Accepted Offers</span>
            <span className="text-emerald-600">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {accepted}
          </p>
          <p className="text-[10px] text-slate-400">
            {accepted > 0 ? "Placement confirmed" : "Awaiting final decision"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">In Process</span>
            <span className="text-amber-600">
              <Clock size={16} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-400">
            {pending}
          </p>
          <p className="text-[10px] text-slate-400">Active evaluation rounds</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile Strength</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              <ShieldCheck size={16} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {strengthScore}%
          </p>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
            {strengthScore >= 80 ? "Top Quartile" : "Good Standing"}
          </p>
        </div>
      </div>

      {/* Main Grid: Status Breakdown + Profile Strength Meter */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Status Breakdown Donut Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Recruiter Competitiveness Index
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Calculated automatically from your academic CGPA, verified active backlogs, and verified technical skill tags.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Academic Index (CGPA {student.cgpa})
                  </span>
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    {student.cgpa >= 8.5 ? "95%" : "75%"}
                  </strong>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(student.cgpa / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Backlog Standing ({student.activeBacklogs} Backlogs)
                  </span>
                  <strong
                    className={
                      student.activeBacklogs === 0
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-amber-600"
                    }
                  >
                    {student.activeBacklogs === 0 ? "100% Clean" : "Requires Clearance"}
                  </strong>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      student.activeBacklogs === 0 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: student.activeBacklogs === 0 ? "100%" : "60%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Technical Stack Depth ({student.skills.length} Skills)
                  </span>
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    {Math.min(student.skills.length * 20, 100)}%
                  </strong>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${Math.min(student.skills.length * 20, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-emerald-50/70 p-3 text-[11px] text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200">
            <span className="font-bold flex items-center gap-1">
              <Sparkles size={12} className="text-emerald-600" />
              Recommendation:
            </span>
            <p className="mt-0.5 opacity-90">
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
