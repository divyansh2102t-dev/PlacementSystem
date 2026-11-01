"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { CompanyDrive, Student } from "@/types";
import { CheckCircle2, AlertCircle, FileText, Send } from "lucide-react";
import { formatCurrencyLpa, formatDate } from "@/lib/utils";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDrive | null;
  student: Student | null;
  onConfirmApply: (companyId: number) => Promise<void>;
}

export function ApplyModal({
  isOpen,
  onClose,
  company,
  student,
  onConfirmApply,
}: ApplyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!company || !student) return null;

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmApply(company.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirm Application: ${company.companyName}`}
      subtitle={`Position: ${company.roleTitle}`}
      icon={<Send size={18} />}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Drive & Compensation Brief */}
        <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                {company.companyName}
              </p>
              <p className="text-[11px] text-slate-500">{company.roleTitle}</p>
            </div>
            <div className="text-right">
              <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">
                {formatCurrencyLpa(company.ctcLpa)}
              </span>
              <p className="text-[10px] text-slate-400">{company.roleType}</p>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <div>
              <span className="text-[10px] text-slate-400">Drive Date:</span>
              <p className="font-semibold">{formatDate(company.driveDate)}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Location:</span>
              <p className="font-semibold">{company.location}</p>
            </div>
          </div>
        </div>

        {/* Verified Student Credentials Passed to Recruiter */}
        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            Verified Student Profile Data (Submitted)
          </h4>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
            <div>
              <span className="text-[10px] text-slate-400">Full Name:</span>
              <p className="font-bold">{student.name}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Roll Number:</span>
              <p className="font-mono font-bold">{student.rollNo}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Department & CGPA:</span>
              <p className="font-semibold">
                {student.department} · {student.cgpa} CGPA
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Active Backlogs:</span>
              <p className="font-semibold">{student.activeBacklogs} Backlogs</p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-emerald-200/50 dark:border-emerald-900/40 text-[11px]">
            <FileText size={13} className="text-emerald-700 dark:text-emerald-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Attached Resume: {student.rollNo}-Resume.pdf
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          By clicking <strong className="text-slate-800 dark:text-slate-200">Submit Application</strong>, you agree to attend all scheduled interview rounds on the specified drive date. Unique application rule is applied.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleApply}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send size={13} />
                <span>Submit Application</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
