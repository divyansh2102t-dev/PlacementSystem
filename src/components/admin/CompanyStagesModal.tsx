"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { CompanyDrive, CompanyStage, DEFAULT_COMPANY_STAGES } from "@/types";
import { useToast } from "@/components/ui/Toast";
import {
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  RotateCcw,
} from "lucide-react";

interface CompanyStagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDrive | null;
  onStagesUpdated: (updatedCompany: CompanyDrive) => void;
}

export function CompanyStagesModal({
  isOpen,
  onClose,
  company,
  onStagesUpdated,
}: CompanyStagesModalProps) {
  const { notify } = useToast();
  const [stages, setStages] = useState<CompanyStage[]>([]);
  const [newStageName, setNewStageName] = useState("");
  const [newStageOrder, setNewStageOrder] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (company) {
      const current =
        company.stages && company.stages.length > 0
          ? [...company.stages].sort((a, b) => a.order - b.order)
          : [...DEFAULT_COMPANY_STAGES];
      setStages(current);
      setNewStageOrder(current.length + 1);
    }
  }, [company]);

  if (!company) return null;

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const targetOrder = Math.max(1, Math.min(newStageOrder, stages.length + 1));
    const newStageItem: CompanyStage = {
      id: `stg-${Date.now()}`,
      name: newStageName.trim(),
      order: targetOrder,
    };

    // Re-index stages inserting the new one at targetOrder
    const updated = [...stages];
    updated.splice(targetOrder - 1, 0, newStageItem);
    const reindexed = updated.map((s, idx) => ({ ...s, order: idx + 1 }));

    setStages(reindexed);
    setNewStageName("");
    setNewStageOrder(reindexed.length + 1);
  };

  const handleRemoveStage = (id: string) => {
    if (stages.length <= 2) {
      notify("A recruitment pipeline must have at least 2 stages.", "error");
      return;
    }
    const filtered = stages
      .filter((s) => s.id !== id)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    setStages(filtered);
    setNewStageOrder(filtered.length + 1);
  };

  const handleMoveStage = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stages.length) return;

    const copy = [...stages];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reindexed = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    setStages(reindexed);
  };

  const handleResetDefaults = () => {
    setStages([...DEFAULT_COMPANY_STAGES]);
    setNewStageOrder(DEFAULT_COMPANY_STAGES.length + 1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: company.id, stages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify(`Hiring stages for ${company.companyName} updated!`);
      onStagesUpdated(data.company || { ...company, stages });
      onClose();
    } catch (err: any) {
      notify(err.message || "Failed to update stages", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Custom Hiring Pipeline: ${company.companyName}`}
      subtitle={`Configure round-by-round candidate progression stages for ${company.roleTitle}`}
      icon={<Layers size={18} className="text-emerald-600" />}
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs">
        {/* Helper Explanation */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-emerald-50/40 p-3.5 text-slate-700 border border-emerald-200/70 shadow-xs">
          <p className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Dynamic Stage Advancement
          </p>
          <p className="mt-1 text-[11px] text-slate-600 leading-relaxed font-medium">
            Candidates only appear in subsequent stages after being evaluated and advanced from prior rounds. The final stage marks the student as officially placed with an offer.
          </p>
        </div>

        {/* Existing Stages List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Configured Stages ({stages.length})
            </span>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-700 transition"
            >
              <RotateCcw size={12} />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="space-y-2">
            {stages.map((stg, idx) => (
              <div
                key={stg.id || idx}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-xs hover:border-emerald-300 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-black text-white shadow-xs">
                    {stg.order}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-xs tracking-tight">{stg.name}</p>
                    <p className="text-[10px] font-medium text-slate-400">
                      {idx === 0
                        ? "Initial Entry Stage"
                        : idx === stages.length - 1
                        ? "Final Round (Offer / Placed)"
                        : `Evaluation Round ${idx}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveStage(idx, "up")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 transition"
                    title="Move Stage Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === stages.length - 1}
                    onClick={() => handleMoveStage(idx, "down")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 transition"
                    title="Move Stage Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveStage(stg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ml-1"
                    title="Delete Stage"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Custom Stage Form */}
        <form
          onSubmit={handleAddStage}
          className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 backdrop-blur-xs"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
            Insert New Stage
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-8">
              <input
                required
                type="text"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none shadow-xs transition"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="number"
                min={1}
                max={stages.length + 1}
                value={newStageOrder}
                onChange={(e) => setNewStageOrder(parseInt(e.target.value, 10) || 1)}
                title="Position number to insert at"
                className="w-full rounded-xl border border-slate-200/80 bg-white/95 px-2 py-2 text-xs text-center font-bold text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none shadow-xs transition"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full h-full flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs py-2 hover:shadow-md hover:brightness-105 active:scale-95 transition"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition disabled:opacity-50"
          >
            <Check size={14} />
            <span>{isSaving ? "Saving..." : "Save Pipeline Stages"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

