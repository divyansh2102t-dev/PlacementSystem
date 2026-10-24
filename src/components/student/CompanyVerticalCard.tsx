"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { CompanyDrive, Student, Application } from "@/types";
import { TierBadge, EligibilityBadge } from "@/components/ui/Badge";
import { checkEligibility } from "@/lib/eligibility";
import { formatCurrencyLpa, formatStipend, formatDate } from "@/lib/utils";

interface CompanyVerticalCardProps {
  company: CompanyDrive;
  student?: Student | null;
  existingApplication?: Application | null;
  onApply?: (company: CompanyDrive) => void;
  onViewDetails: (company: CompanyDrive) => void;
  isAdmin?: boolean;
  onReviewApplicants?: (company: CompanyDrive) => void;
  onEdit?: (company: CompanyDrive) => void;
  onDelete?: (company: CompanyDrive) => void;
}

export function CompanyVerticalCard({
  company,
  student,
  existingApplication,
  onApply,
  onViewDetails,
  isAdmin = false,
  onReviewApplicants,
  onEdit,
  onDelete,
}: CompanyVerticalCardProps) {
  const eligibility = student ? checkEligibility(student, company, existingApplication) : null;

  const isDeadlinePassed = new Date(`${company.deadline}T23:59:59`) < new Date();

  return (
    <article
      className="group relative flex flex-col w-full rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all duration-150 dark:border-slate-800 dark:bg-slate-800/90"
    >
      {/* Top Header Row: Company + Package + Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Logo, Company Name, Role, Tier */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-base font-black text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 shadow-xs border border-emerald-200/50 dark:border-emerald-800/50">
            {company.logo || company.companyName.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {company.companyName}
              </h3>
              <TierBadge tier={company.tier} />
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {company.roleType}
              </span>
            </div>

            <p className="mt-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              {company.roleTitle}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                {company.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase size={12} className="text-slate-400 shrink-0" />
                {company.industry}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Package & Deadline */}
        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-lg font-black tracking-tight text-emerald-700 dark:text-emerald-400">
              {formatCurrencyLpa(company.ctcLpa)}
            </span>
            <p className="text-[10px] text-slate-400 font-medium">
              Stipend: {formatStipend(company.stipendMonthly)}
            </p>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Clock size={12} className={isDeadlinePassed ? "text-rose-500" : "text-amber-600"} />
            <span>
              Deadline: <strong className={isDeadlinePassed ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300"}>{formatDate(company.deadline)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Description Summary */}
      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
        {company.description}
      </p>

      {/* Prominent Eligibility Criteria Section (Requirement 3) */}
      <div className="mt-3.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Eligibility Criteria
          </span>
          <span className="text-[10px] text-slate-400">
            Drive Date: <strong className="text-slate-700 dark:text-slate-300">{formatDate(company.driveDate)}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Min CGPA Chip */}
          <div className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <span className="text-[10px] text-slate-400">Min CGPA:</span>
            <strong className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {company.minCgpa.toFixed(2)}
            </strong>
          </div>

          {/* Allowed Branches Chips */}
          <div className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <span className="text-[10px] text-slate-400">Branches:</span>
            <div className="flex gap-1">
              {company.eligibleDepts.map((d) => (
                <span
                  key={d}
                  className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Max Backlogs */}
          <div className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <span className="text-[10px] text-slate-400">Backlogs:</span>
            <strong className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {company.maxBacklogs === 0 ? "0 Clean" : `Max ${company.maxBacklogs}`}
            </strong>
          </div>

          {/* Batch */}
          <div className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <span className="text-[10px] text-slate-400">Batch:</span>
            <strong className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {company.eligibleBatch}
            </strong>
          </div>

          {/* Required Skills */}
          {company.requiredSkills && company.requiredSkills.length > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
              <span className="text-[10px] text-slate-400">Skills:</span>
              <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-300">
                {company.requiredSkills.slice(0, 3).join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Student Specific Eligibility Feedback Reason Banner */}
        {!isAdmin && eligibility && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <EligibilityBadge
                eligible={eligibility.eligible}
                isApplied={eligibility.isApplied}
                isExpired={eligibility.isExpired}
              />
              {!eligibility.eligible && (
                <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                  {eligibility.reasons[0]}
                </span>
              )}
              {eligibility.eligible && !eligibility.isApplied && (
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  You meet all CGPA, branch, and backlog criteria.
                </span>
              )}
            </div>

            {student && (
              <span className="text-[10px] text-slate-400">
                Your profile: {student.department} · CGPA {student.cgpa} · {student.activeBacklogs} backlogs
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>{company.applicantsCount} Students Applied</span>
          <span>•</span>
          <button
            onClick={() => onViewDetails(company)}
            className="flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 transition"
          >
            <span>View Details</span>
            <ExternalLink size={12} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Specific Action Buttons */}
          {isAdmin ? (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(company)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(company)}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 transition"
                >
                  Delete
                </button>
              )}
              {onReviewApplicants && (
                <button
                  onClick={() => onReviewApplicants(company)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition"
                >
                  <span>Review Applicants ({company.applicantsCount})</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </>
          ) : (
            /* Student Action: Apply Button */
            <>
              {eligibility?.isApplied ? (
                <button
                  disabled
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                >
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Applied</span>
                </button>
              ) : isDeadlinePassed ? (
                <button
                  disabled
                  className="rounded-xl bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                >
                  Deadline Closed
                </button>
              ) : eligibility?.eligible ? (
                <button
                  onClick={() => onApply && onApply(company)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition"
                >
                  <span>Apply Now</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  disabled
                  title={eligibility?.reasons[0] || "You do not meet the eligibility criteria"}
                  className="rounded-xl bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                >
                  Not Eligible
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
