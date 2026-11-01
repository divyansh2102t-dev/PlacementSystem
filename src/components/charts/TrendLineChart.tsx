"use client";

import React from "react";

interface TrendPoint {
  date: string;
  applications: number;
  acceptances: number;
}

interface TrendLineChartProps {
  data: TrendPoint[];
}

export function TrendLineChart({ data }: TrendLineChartProps) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => Math.max(d.applications, d.acceptances)), 10);
  const width = 480;
  const height = 160;
  const padding = 24;

  const stepX = (width - padding * 2) / (data.length - 1 || 1);

  // Generate SVG path for applications
  const appPoints = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.applications / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  });
  const appPath = `M ${appPoints.join(" L ")}`;

  // Generate SVG path for acceptances
  const accPoints = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.acceptances / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  });
  const accPath = `M ${accPoints.join(" L ")}`;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[400px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Horizontal Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
          />

          {/* Applications Line */}
          <path
            d={appPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {data.map((d, i) => {
            const x = padding + i * stepX;
            const y = height - padding - (d.applications / maxVal) * (height - padding * 2);
            return (
              <circle
                key={`app-${i}`}
                cx={x}
                cy={y}
                r="4"
                fill="#10b981"
                className="stroke-white dark:stroke-slate-900"
                strokeWidth="2"
              />
            );
          })}

          {/* Acceptances Line */}
          <path
            d={accPath}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {data.map((d, i) => {
            const x = padding + i * stepX;
            const y = height - padding - (d.acceptances / maxVal) * (height - padding * 2);
            return (
              <circle
                key={`acc-${i}`}
                cx={x}
                cy={y}
                r="4"
                fill="#0ea5e9"
                className="stroke-white dark:stroke-slate-900"
                strokeWidth="2"
              />
            );
          })}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            const x = padding + i * stepX;
            return (
              <text
                key={d.date}
                x={x}
                y={height - 6}
                textAnchor="middle"
                className="text-[9px] fill-slate-400 font-mono"
              >
                {d.date}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Applications Submitted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-600 dark:text-slate-300">Offers Extended</span>
          </div>
        </div>
      </div>
    </div>
  );
}
