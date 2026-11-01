"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Application, CompanyDrive, CompanyStage, DEFAULT_COMPANY_STAGES } from "@/types";
import { StageBadge } from "@/components/ui/Badge";
import { CompanyStagesModal } from "./CompanyStagesModal";
import {
  Users,
  Check,
  X,
  FileText,
  Search,
  MessageSquare,
  ChevronRight,
  Settings,
  ArrowRight,
  Award,
} from "lucide-react";

interface AdminCompanyApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDrive | null;
  applications: Application[];
  onUpdateStatus: (
    appId: number,
    stage: string,
    remark?: string
  ) => Promise<void>;
  onBulkUpdate: (
    appIds: number[],
    stage: string,
    remark?: string
  ) => Promise<void>;
  onCompanyUpdated?: (company: CompanyDrive) => void;
}

export function AdminCompanyApplicantsModal({
  isOpen,
  onClose,
  company,
  applications,
  onUpdateStatus,
  onBulkUpdate,
  onCompanyUpdated,
}: AdminCompanyApplicantsModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [remarksInput, setRemarksInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStagesModalOpen, setIsStagesModalOpen] = useState(false);

  // Active Stage Filter: "all" or stage name
  const [activeStageFilter, setActiveStageFilter] = useState<string>("all");

  if (!company) return null;

  const companyStages: CompanyStage[] =
    company.stages && company.stages.length > 0
      ? [...company.stages].sort((a, b) => a.order - b.order)
      : [...DEFAULT_COMPANY_STAGES];

  // Map each application to its stage
  const getStageIndex = (stageName: string): number => {
    const idx = companyStages.findIndex(
      (s) => s.name.toLowerCase() === (stageName || "").toLowerCase()
    );
    return idx !== -1 ? idx : 0;
  };

  // Filtered by stage tab and search query
  const filteredApps = applications.filter((app) => {
    const q = search.toLowerCase();
    const matchesSearch =
      app.studentName.toLowerCase().includes(q) ||
      app.rollNo.toLowerCase().includes(q) ||
      app.department.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeStageFilter === "all") return true;

    // Filter by specific stage tab
    return app.stage.toLowerCase() === activeStageFilter.toLowerCase();
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

  const handleAdvanceToNextStage = async (app: Application) => {
    const currentIdx = getStageIndex(app.stage);
    if (currentIdx < companyStages.length - 1) {
      const nextStage = companyStages[currentIdx + 1];
      setIsProcessing(true);
      try {
        await onUpdateStatus(
          app.id,
          nextStage.name,
          remarksInput || `Advanced to ${nextStage.name} round`
        );
        setRemarksInput("");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleReject = async (appId: number) => {
    setIsProcessing(true);
    try {
      await onUpdateStatus(
        appId,
        "Rejected",
        remarksInput || "Not shortlisted for further rounds"
      );
      setRemarksInput("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkAdvance = async () => {
    if (selectedIds.length === 0) return;

    // Find the next stage based on the active tab or default
    let targetStageName = "Shortlisting";
    if (activeStageFilter !== "all") {
      const currentIdx = getStageIndex(activeStageFilter);
      if (currentIdx < companyStages.length - 1) {
        targetStageName = companyStages[currentIdx + 1].name;
      }
    }

    setIsProcessing(true);
    try {
      await onBulkUpdate(
        selectedIds,
        targetStageName,
        remarksInput || `Bulk advanced to ${targetStageName}`
      );
      setSelectedIds([]);
      setRemarksInput("");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Candidate Pipeline: ${company.companyName}`}
        subtitle={`${company.roleTitle} · ${applications.length} Candidates Enrolled · Stage Progression Desk`}
        icon={<Users size={18} className="text-emerald-600" />}
        maxWidth="4xl"
      >
        <div className="space-y-4 text-xs">
          {/* Top Stage Bar: Dynamic Pipeline Steps */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Evaluation Rounds & Progression Tabs
              </span>
              <button
                type="button"
                onClick={() => setIsStagesModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
              >
                <Settings size={12} className="text-slate-500" />
                <span>Configure Company Stages ({companyStages.length})</span>
              </button>
            </div>

            {/* Stages Scrollable Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              <button
                type="button"
                onClick={() => setActiveStageFilter("all")}
                className={`rounded-xl px-3 py-1.5 font-bold text-xs whitespace-nowrap transition border ${
                  activeStageFilter === "all"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Applicants ({applications.length})
              </button>

              {companyStages.map((stg, idx) => {
                const count = applications.filter(
                  (a) => a.stage.toLowerCase() === stg.name.toLowerCase()
                ).length;
                const isSelected =
                  activeStageFilter.toLowerCase() === stg.name.toLowerCase();

                return (
                  <button
                    key={stg.id || idx}
                    type="button"
                    onClick={() => setActiveStageFilter(stg.name)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold text-xs whitespace-nowrap transition border ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-emerald-200"
                    }`}
                  >
                    <span
                      className={`grid h-4.5 w-4.5 place-items-center rounded-full text-[10px] ${
                        isSelected
                          ? "bg-white text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {stg.order}
                    </span>
                    <span>{stg.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                        isSelected
                          ? "bg-emerald-700 text-white"
                          : count > 0
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Bulk Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-t border-slate-100 pt-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate by name, roll no, or branch..."
                className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedIds.length} selected
              </span>
              <button
                disabled={selectedIds.length === 0 || isProcessing}
                onClick={handleBulkAdvance}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-40 transition"
              >
                <Check size={13} /> Advance Selected
              </button>
              <button
                disabled={selectedIds.length === 0 || isProcessing}
                onClick={() => {
                  if (confirm("Reject selected applicants?")) {
                    onBulkUpdate(selectedIds, "Rejected", remarksInput || "Profile not moved forward");
                    setSelectedIds([]);
                  }
                }}
                className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-40 transition"
              >
                <X size={13} /> Reject
              </button>
            </div>
          </div>

          {/* Optional Evaluation Remark Input */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 border border-slate-200">
            <MessageSquare size={14} className="text-slate-400 ml-1 shrink-0" />
            <input
              value={remarksInput}
              onChange={(e) => setRemarksInput(e.target.value)}
              placeholder="Add optional note/feedback for candidate advancement..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Candidate Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
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
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">CGPA</th>
                  <th className="p-3">Resume</th>
                  <th className="p-3">Current Round</th>
                  <th className="p-3 text-right">Stage Advancement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const isSelected = selectedIds.includes(app.id);
                  const currentIdx = getStageIndex(app.stage);
                  const hasNextStage = currentIdx < companyStages.length - 1;
                  const nextStage = hasNextStage ? companyStages[currentIdx + 1] : null;
                  const isFinalStage =
                    currentIdx === companyStages.length - 1 ||
                    app.stage.toLowerCase().includes("hired") ||
                    app.stage.toLowerCase() === "accepted";

                  return (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50 transition ${
                        isSelected ? "bg-emerald-50/40" : ""
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
                      <td className="p-3 font-bold text-slate-900">
                        {app.studentName}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {app.rollNo}
                      </td>
                      <td className="p-3">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                          {app.department}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900">
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
                          className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
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
                          {hasNextStage && !app.stage.toLowerCase().includes("reject") ? (
                            <button
                              disabled={isProcessing}
                              onClick={() => handleAdvanceToNextStage(app)}
                              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition shadow-2xs"
                              title={`Advance to ${nextStage?.name}`}
                            >
                              <span>Advance to {nextStage?.name}</span>
                              <ArrowRight size={11} />
                            </button>
                          ) : isFinalStage ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <Award size={12} /> Hired / Placed
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Archived</span>
                          )}

                          {!isFinalStage && !app.stage.toLowerCase().includes("reject") && (
                            <button
                              disabled={isProcessing}
                              onClick={() => handleReject(app.id)}
                              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition"
                              title="Reject Candidate"
                            >
                              <X size={11} />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No candidates currently in this stage.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Embedded Company Stages Config Modal */}
      <CompanyStagesModal
        isOpen={isStagesModalOpen}
        onClose={() => setIsStagesModalOpen(false)}
        company={company}
        onStagesUpdated={(updated) => {
          if (onCompanyUpdated) onCompanyUpdated(updated);
        }}
      />
    </>
  );
}
