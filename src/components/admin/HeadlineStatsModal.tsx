"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { HeadlineStatsConfig, DEFAULT_HEADLINE_STATS } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { BarChart3, Check, RefreshCw, Eye, Sparkles } from "lucide-react";

interface HeadlineStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: (stats: HeadlineStatsConfig) => void;
}

export function HeadlineStatsModal({
  isOpen,
  onClose,
  onUpdated,
}: HeadlineStatsModalProps) {
  const { notify } = useToast();
  const [stats, setStats] = useState<HeadlineStatsConfig>(DEFAULT_HEADLINE_STATS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/headline-stats")
        .then((r) => r.json())
        .then((data) => {
          if (data && data.highestPackage) {
            setStats(data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/headline-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify("Homepage headline stats updated successfully!");
      if (onUpdated) onUpdated(stats);
      onClose();
    } catch (err: any) {
      notify(err.message || "Failed to update headline stats", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setStats({ ...DEFAULT_HEADLINE_STATS });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Homepage Placement Highlights"
      subtitle="Edit and publish live headline placement statistics displayed on the homepage ticker strip"
      icon={<BarChart3 size={18} className="text-emerald-600" />}
      maxWidth="3xl"
    >
      <div className="space-y-6 text-xs text-slate-700">
        {/* Live Preview Strip */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
          <div className="flex items-center justify-between pb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Eye size={13} className="text-emerald-600" />
              Live Homepage Preview
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              Real-time sync to database
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs text-center">
            {/* Card 1 */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {stats.highestPackage.label || "HIGHEST PACKAGE"}
              </span>
              <p className="text-xl font-black text-emerald-700">
                {stats.highestPackage.value}
              </p>
              <span className="text-[11px] text-slate-500 block">
                {stats.highestPackage.subtext}
              </span>
            </div>

            {/* Card 2 */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {stats.averageCtc.label || "AVERAGE CTC"}
              </span>
              <p className="text-xl font-black text-slate-900">
                {stats.averageCtc.value}
              </p>
              <span className="text-[11px] text-slate-500 block">
                {stats.averageCtc.subtext}
              </span>
            </div>

            {/* Card 3 */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {stats.placementRate.label || "PLACEMENT RATE"}
              </span>
              <p className="text-xl font-black text-emerald-700">
                {stats.placementRate.value}
              </p>
              <span className="text-[11px] text-slate-500 block">
                {stats.placementRate.subtext}
              </span>
            </div>

            {/* Card 4 */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {stats.recruitingPartners.label || "RECRUITING PARTNERS"}
              </span>
              <p className="text-xl font-black text-slate-900">
                {stats.recruitingPartners.value}
              </p>
              <span className="text-[11px] text-slate-500 block">
                {stats.recruitingPartners.subtext}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Stat Editor Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 Editor: Highest Package */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
              <span>Card 1: Highest Package</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Metric 1
              </span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Header Label
              </label>
              <input
                type="text"
                value={stats.highestPackage.label}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    highestPackage: { ...stats.highestPackage, label: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Display Value
              </label>
              <input
                type="text"
                value={stats.highestPackage.value}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    highestPackage: { ...stats.highestPackage, value: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-emerald-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={stats.highestPackage.subtext}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    highestPackage: { ...stats.highestPackage, subtext: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Card 2 Editor: Average CTC */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
              <span>Card 2: Average CTC</span>
              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                Metric 2
              </span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Header Label
              </label>
              <input
                type="text"
                value={stats.averageCtc.label}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    averageCtc: { ...stats.averageCtc, label: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Display Value
              </label>
              <input
                type="text"
                value={stats.averageCtc.value}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    averageCtc: { ...stats.averageCtc, value: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={stats.averageCtc.subtext}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    averageCtc: { ...stats.averageCtc, subtext: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Card 3 Editor: Placement Rate */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
              <span>Card 3: Placement Rate</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Metric 3
              </span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Header Label
              </label>
              <input
                type="text"
                value={stats.placementRate.label}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    placementRate: { ...stats.placementRate, label: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Display Value
              </label>
              <input
                type="text"
                value={stats.placementRate.value}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    placementRate: { ...stats.placementRate, value: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-emerald-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={stats.placementRate.subtext}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    placementRate: { ...stats.placementRate, subtext: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Card 4 Editor: Recruiting Partners */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
              <span>Card 4: Recruiting Partners</span>
              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                Metric 4
              </span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Header Label
              </label>
              <input
                type="text"
                value={stats.recruitingPartners.label}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    recruitingPartners: { ...stats.recruitingPartners, label: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Display Value
              </label>
              <input
                type="text"
                value={stats.recruitingPartners.value}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    recruitingPartners: { ...stats.recruitingPartners, value: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={stats.recruitingPartners.subtext}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    recruitingPartners: { ...stats.recruitingPartners, subtext: e.target.value },
                  })
                }
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <RefreshCw size={13} />
            Reset to Default Figures
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Save Headline Stats</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

