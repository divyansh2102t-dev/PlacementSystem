"use client";

import React from "react";

interface BarChartItem {
  label: string;
  value: number;
  total?: number;
  percentage?: number;
  color?: string;
  secondaryLabel?: string;
}

interface BarChartProps {
  items: BarChartItem[];
  title?: string;
}

export function BarChart({ items, title }: BarChartProps) {
  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          {title}
        </h4>
      )}
      <div className="space-y-2.5">
        {items.map((item) => {
          const pct =
            item.percentage !== undefined
              ? item.percentage
              : Math.round((item.value / maxValue) * 100);

          return (
            <div key={item.label} className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {item.label}
                </span>
                <span className="text-slate-500 font-medium">
                  {item.secondaryLabel || `${item.value} (${pct}%)`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/60">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.color || "bg-gradient-to-r from-emerald-500 to-teal-400"
                  }`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
