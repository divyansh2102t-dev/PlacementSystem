"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Application, CompanyDrive, ApplicationStage } from "@/types";
import { StageBadge } from "@/components/ui/Badge";
import { formatCurrencyLpa, formatDate } from "@/lib/utils";
import {
  Users,
  Check,
  X,
  FileText,
  Search,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface AdminCompanyApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDrive | null;
  applications: Application[];
  onUpdateStatus: (
    appId: number,
    stage: ApplicationStage,
    remark?: string
  ) => Promise<void>;
  onBulkUpdate: (
    appIds: number[],
    stage: ApplicationStage,
    remark?: string
  ) => Promise<void>;
}

export function AdminCompanyApplicantsModal({
  isOpen,
  onClose,
  company,
  applications,
  onUpdateStatus,
  onBulkUpdate,
}: AdminCompanyApplicantsModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [remarksInput, setRemarksInput] = useState("");
  const [activeRemarkAppId, setActiveRemarkAppId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!company) return null;

  const filteredApps = applications.filter((app) => {
    const q = search.toLowerCase();
    return (
      app.studentName.toLowerCase().includes(q) ||
      app.rollNo.toLowerCase().includes(q) ||
      app.department.toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApps.map((a) => a.id));
    }
  };

  const handleSingleDecision = async (
    appId: number,
    stage: ApplicationStage,
    remark?: string
  ) => {
    setIsProcessing(true);
    try {
      await onUpdateStatus(appId, stage, remark || remarksInput);
      setActiveRemarkAppId(null);
      setRemarksInput("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDecision = async (stage: ApplicationStage) => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    try {
      await onBulkUpdate(selectedIds, stage, remarksInput || `Bulk ${stage} by Placement Cell`);
      setSelectedIds([]);
      setRemarksInput("");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Applicants: ${company.companyName}`}
      subtitle={`${company.roleTitle} · Total ${applications.length} Candidates Enrolled`}
      icon={<Users size={18} />}
      maxWidth="3xl"
    >
      <div className="space-y-3.5 text-xs">
        {/* Toolbar: Search & Bulk Controls */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or roll no..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
            />
          </div>

          {/* Bulk Accept / Reject Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              {selectedIds.length} selected
            </span>
            <button
              disabled={selectedIds.length === 0 || isProcessing}
              onClick={() => handleBulkDecision("Accepted")}
              className="flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 disabled:opacity-40 transition"
            >
              <Check size={13} /> Bulk Accept
            </button>
            <button
              disabled={selectedIds.length === 0 || isProcessing}
              onClick={() => handleBulkDecision("Rejected")}
              className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-40 transition"
            >
              <X size={13} /> Bulk Reject
            </button>
          </div>
        </div>

        {/* Remark input if any */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          <MessageSquare size={14} className="text-slate-400 ml-1 shrink-0" />
          <input
            value={remarksInput}
            onChange={(e) => setRemarksInput(e.target.value)}
            placeholder="Add an optional decision remark (e.g. Cleared technical interview with 9.2 rating)..."
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Applicants Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 dark:bg-slate-900 border-b dark:border-slate-800">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      filteredApps.length > 0 &&
                      selectedIds.length === filteredApps.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-emerald-600"
                  />
                </th>
                <th className="p-3">Roll No & Student</th>
                <th className="p-3">Branch</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Resume</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Decision Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => {
                const isSelected = selectedIds.includes(app.id);

                return (
                  <tr
                    key={app.id}
                    className={`hover:bg-slate-50/70 transition dark:hover:bg-slate-800/40 ${
                      isSelected ? "bg-emerald-50/30 dark:bg-emerald-950/20" : ""
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(app.id)}
                        className="rounded text-emerald-600"
                      />
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      <div>{app.studentName}</div>
                      <span className="font-mono text-[10px] text-slate-400 font-normal">
                        {app.rollNo}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {app.department}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {app.cgpa}
                    </td>
                    <td className="p-3">
                      <a
                        href={app.resumeUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          if (!app.resumeUrl) e.preventDefault();
                        }}
                        className="flex items-center gap-1 font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                      >
                        <FileText size={12} />
                        <span>PDF</span>
                      </a>
                    </td>
                    <td className="p-3">
                      <StageBadge stage={app.stage} />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          title="Accept Application"
                          disabled={isProcessing || app.stage === "Accepted"}
                          onClick={() => handleSingleDecision(app.id, "Accepted")}
                          className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 disabled:opacity-40 transition"
                        >
                          <Check size={12} /> Accept
                        </button>
                        <button
                          title="Reject Application"
                          disabled={isProcessing || app.stage === "Rejected"}
                          onClick={() => handleSingleDecision(app.id, "Rejected")}
                          className="flex items-center gap-1 rounded-lg bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-800 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300 disabled:opacity-40 transition"
                        >
                          <X size={12} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No applicants found matching this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
