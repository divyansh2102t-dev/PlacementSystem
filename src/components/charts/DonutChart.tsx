"use client";

import React from "react";

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  totalLabel?: string;
  size?: number;
}

export function DonutChart({ data, totalLabel = "Total", size = 160 }: DonutChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  let cumulativeAngle = 0;
  const radius = 60;
  const strokeWidth = 24;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 justify-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            data.map((slice) => {
              const strokeDasharray = `${(slice.value / total) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativeAngle;
              cumulativeAngle += (slice.value / total) * circumference;

              return (
                <circle
                  key={slice.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
            {total}
          </span>
          <span className="text-[10px] font-semibold uppercase text-slate-400">
            {totalLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 text-xs">
        {data.map((slice) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <div key={slice.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {slice.label}:
              </span>
              <strong className="text-slate-800 dark:text-slate-100 font-bold ml-auto pl-2">
                {slice.value} ({pct}%)
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}
