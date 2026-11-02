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
      <div className="space-y-4 text-xs text-slate-700">
        {/* Tier & CTC Highlights */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/60 border border-emerald-200/80 p-3.5 shadow-2xs">
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Total Package</span>
            <p className="mt-0.5 text-base font-black text-emerald-950">
              {formatCurrencyLpa(company.ctcLpa)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 border border-slate-200/80 p-3.5 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Monthly Stipend</span>
            <p className="mt-0.5 text-xs font-bold text-slate-900">
              {formatStipend(company.stipendMonthly)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 border border-slate-200/80 p-3.5 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tier Category</span>
            <div className="mt-1">
              <TierBadge tier={company.tier} />
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 border border-slate-200/80 p-3.5 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Location</span>
            <p className="mt-0.5 text-xs font-bold text-slate-900 truncate">
              {company.location}
            </p>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h4 className="font-extrabold text-slate-900 mb-1">
            Job Role & Opportunity Overview
          </h4>
          <p className="leading-relaxed text-slate-600">
            {company.description}
          </p>
        </div>

        {/* Criteria Specifications */}
        <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/70 shadow-2xs">
          <h4 className="font-extrabold text-slate-900 mb-2.5">
            Institutional Eligibility Rules
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-[11px]">
            <div>
              <span className="text-slate-400 font-semibold">Minimum CGPA:</span>
              <p className="font-extrabold text-slate-900">
                {company.minCgpa.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Maximum Backlogs:</span>
              <p className="font-extrabold text-slate-900">
                {company.maxBacklogs} Allowed
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Graduating Batch:</span>
              <p className="font-extrabold text-slate-900">
                {company.eligibleBatch}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <span className="text-slate-400 font-semibold">Allowed Engineering Branches:</span>
              <p className="font-bold text-emerald-800">
                {company.eligibleDepts.join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Recruitment Process Stages */}
        {company.stages && company.stages.length > 0 && (
          <div>
            <h4 className="font-extrabold text-slate-900 mb-2">
              Hiring Stages & Selection Workflow
            </h4>
            <div className="flex flex-wrap gap-2">
              {company.stages
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((stg) => (
                  <div
                    key={stg.id}
                    className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-[11px] shadow-2xs"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-extrabold text-emerald-700">
                      {stg.order}
                    </span>
                    <span className="font-bold text-slate-800">
                      {stg.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Required Technical Skills */}
        {company.requiredSkills && company.requiredSkills.length > 0 && (
          <div>
            <h4 className="font-extrabold text-slate-900 mb-2">
              Target Skills & Competencies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {company.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Schedule */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-medium">
          <span>
            Application Deadline: <strong className="text-slate-800">{formatDate(company.deadline)}</strong>
          </span>
          <span>
            Campus Drive: <strong className="text-slate-800">{formatDate(company.driveDate)}</strong>
          </span>
        </div>
      </div>
    </Modal>
  );
}
