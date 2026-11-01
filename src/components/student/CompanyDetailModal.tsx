"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { CompanyDrive } from "@/types";
import { TierBadge } from "@/components/ui/Badge";
import { formatCurrencyLpa, formatStipend, formatDate } from "@/lib/utils";
import { Building2, Calendar, MapPin, Check, Briefcase } from "lucide-react";

interface CompanyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDrive | null;
}

export function CompanyDetailModal({
  isOpen,
  onClose,
  company,
}: CompanyDetailModalProps) {
  if (!company) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={company.companyName}
      subtitle={`${company.roleTitle} · ${company.roleType}`}
      icon={<Building2 size={18} />}
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
        {/* Tier & CTC Highlights */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <span className="text-[10px] text-slate-400">Total Package</span>
            <p className="mt-0.5 text-sm font-black text-emerald-700 dark:text-emerald-400">
              {formatCurrencyLpa(company.ctcLpa)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <span className="text-[10px] text-slate-400">Monthly Stipend</span>
            <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              {formatStipend(company.stipendMonthly)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <span className="text-[10px] text-slate-400">Tier Category</span>
            <div className="mt-1">
              <TierBadge tier={company.tier} />
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <span className="text-[10px] text-slate-400">Location</span>
            <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {company.location}
            </p>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-1">
            Job Role & Opportunity Overview
          </h4>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            {company.description}
          </p>
        </div>

        {/* Criteria Specifications */}
        <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <h4 className="font-bold text-slate-900 dark:text-white mb-2">
            Institutional Eligibility Rules (DBMS Check)
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-[11px]">
            <div>
              <span className="text-slate-400">Minimum CGPA:</span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {company.minCgpa.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Maximum Backlogs:</span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {company.maxBacklogs} Allowed
              </p>
            </div>
            <div>
              <span className="text-slate-400">Graduating Batch:</span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {company.eligibleBatch}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <span className="text-slate-400">Allowed Engineering Branches:</span>
              <p className="font-bold text-emerald-800 dark:text-emerald-300">
                {company.eligibleDepts.join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Required Technical Skills */}
        {company.requiredSkills && company.requiredSkills.length > 0 && (
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
              Target Skills & Competencies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {company.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Schedule */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800 text-[11px] text-slate-500">
          <span>
            Application Deadline: <strong>{formatDate(company.deadline)}</strong>
          </span>
          <span>
            Campus Drive: <strong>{formatDate(company.driveDate)}</strong>
          </span>
        </div>
      </div>
    </Modal>
  );
}
