"use client";

import React from "react";

export function SvgBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none ${className}`}
    >
      {/* Ambient Radial Color Washes */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-emerald-100/50 via-teal-50/30 to-transparent blur-3xl rounded-full" />
      <div className="absolute top-[25%] -left-36 w-[450px] h-[450px] bg-emerald-200/25 blur-3xl rounded-full" />
      <div className="absolute top-[50%] -right-36 w-[500px] h-[500px] bg-teal-200/25 blur-3xl rounded-full" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[350px] bg-emerald-100/30 blur-3xl rounded-full" />

      {/* Layered Organic Flowing SVG Wave Ribbons & Contours (No Grid) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 960"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wave Gradients */}
          <linearGradient id="ph-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="ph-wave-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
            <stop offset="60%" stopColor="#0d9488" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="ph-stroke-grad-1" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="35%" stopColor="#14b8a6" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#0d9488" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="ph-stroke-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="ph-circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Top Floating SVG Ribbon Waves */}
        <path
          d="M0,0 L1440,0 L1440,240 C1200,320 980,140 720,220 C460,300 240,160 0,260 Z"
          fill="url(#ph-wave-grad-1)"
        />
        <path
          d="M0,80 C320,190 540,60 820,150 C1100,240 1280,120 1440,180"
          stroke="url(#ph-stroke-grad-1)"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M0,140 C280,240 580,120 900,210 C1220,300 1340,190 1440,230"
          stroke="url(#ph-stroke-grad-2)"
          strokeWidth="1.5"
          strokeDasharray="8 10"
          fill="none"
        />

        {/* Mid-Page Flowing Curves */}
        <path
          d="M-100,480 C260,380 620,620 1020,440 C1280,320 1400,520 1540,460"
          stroke="url(#ph-stroke-grad-1)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M-50,540 C340,440 700,680 1100,500 C1320,400 1460,560 1560,510"
          stroke="url(#ph-stroke-grad-2)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Lower Fluid Wave Section */}
        <path
          d="M0,740 C300,660 620,840 980,720 C1240,640 1380,780 1440,750 L1440,960 L0,960 Z"
          fill="url(#ph-wave-grad-2)"
        />
        <path
          d="M0,720 C360,640 700,810 1060,700 C1300,620 1400,740 1440,710"
          stroke="url(#ph-stroke-grad-1)"
          strokeWidth="2"
          fill="none"
        />

        {/* Floating Concentric Vector Orbs */}
        <circle cx="160" cy="220" r="90" fill="url(#ph-circle-grad)" />
        <circle cx="160" cy="220" r="130" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="6 6" fill="none" />

        <circle cx="1320" cy="380" r="110" fill="url(#ph-circle-grad)" />
        <circle cx="1320" cy="380" r="160" stroke="#0d9488" strokeOpacity="0.12" strokeWidth="1" fill="none" />

        <circle cx="720" cy="640" r="75" stroke="#34d399" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="4 8" fill="none" />
      </svg>
    </div>
  );
}
