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
        <div className="rounded-2xl bg-slate-50/70 p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
            <div>
              <p className="font-extrabold text-slate-900 text-sm">
                {company.companyName}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">{company.roleTitle}</p>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-emerald-700 text-base">
                {formatCurrencyLpa(company.ctcLpa)}
              </span>
              <p className="text-[10px] text-slate-400 font-medium">{company.roleType}</p>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold">Drive Date:</span>
              <p className="font-bold text-slate-800">{formatDate(company.driveDate)}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold">Location:</span>
              <p className="font-bold text-slate-800">{company.location}</p>
            </div>
          </div>
        </div>

        {/* Verified Student Credentials Passed to Recruiter */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 shadow-2xs">
          <h4 className="font-extrabold text-emerald-900 flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 size={15} className="text-emerald-600" />
            Verified Student Profile Data (Submitted)
          </h4>

          <div className="grid grid-cols-2 gap-2.5 text-[11px] text-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold">Full Name:</span>
              <p className="font-bold text-slate-900">{student.name}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold">Roll Number:</span>
              <p className="font-mono font-bold text-slate-900">{student.rollNo}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold">Department & CGPA:</span>
              <p className="font-bold text-slate-900">
                {student.department} · {student.cgpa} CGPA
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold">Active Backlogs:</span>
              <p className="font-bold text-slate-900">{student.activeBacklogs} Backlogs</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-emerald-200/60 text-[11px]">
            <FileText size={13} className="text-emerald-700" />
            <span className="font-bold text-slate-800">
              Attached Resume: {student.rollNo}-Resume.pdf
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          By clicking <strong className="text-slate-900">Submit Application</strong>, you agree to attend all scheduled interview rounds on the specified drive date. Unique application rule is applied.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200/60">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleApply}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-2 text-xs font-bold text-white shadow-xs hover:from-emerald-700 hover:to-teal-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50"
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
