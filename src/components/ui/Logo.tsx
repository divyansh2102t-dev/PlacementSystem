"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  href?: string;
}

export function LogoIcon({ size = 38, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1 ${className}`}
    >
      <defs>
        {/* Modern Vibrant Gradient */}
        <linearGradient id="ph-logo-grad" x1="2" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="0.45" stopColor="#10b981" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>

        <linearGradient id="ph-arrow-grad" x1="16" y1="12" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#d1fae5" />
        </linearGradient>

        <filter id="ph-glow-shadow" x="0" y="2" width="48" height="46" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#059669" floodOpacity="0.32" />
        </filter>
      </defs>

      {/* Rounded Squircle Shield with Drop Shadow */}
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="13"
        fill="url(#ph-logo-grad)"
        filter="url(#ph-glow-shadow)"
      />

      {/* Glossy Inner Border */}
      <rect
        x="4.2"
        y="4.2"
        width="39.6"
        height="39.6"
        rx="11.8"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.4"
      />

      {/* Stylized Intersecting 'P' & Ascending Milestone Trajectory */}
      {/* Stem of P */}
      <path
        d="M16 34V14C16 13.4477 16.4477 13 17 13H25C29.4183 13 33 16.5817 33 21C33 25.4183 29.4183 29 25 29H18.5"
        stroke="url(#ph-arrow-grad)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dynamic Ascending Career Rocket / Chevron Arrow */}
      <path
        d="M21 21L27 15L33 21"
        stroke="#ffffff"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Apex Opportunity Sparkle Star */}
      <circle cx="27" cy="15" r="2.2" fill="#ffffff" />
      <circle cx="27" cy="15" r="4.5" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

export function Logo({ size = "md", showText = true, className = "", href = "/" }: LogoProps) {
  const pixelSize = size === "sm" ? 34 : size === "lg" ? 48 : 40;

  const content = (
    <div className={`flex items-center gap-2.5 transition group select-none ${className}`}>
      <LogoIcon size={pixelSize} />
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-none">
            <span
              className={`font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 ${
                size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg"
              }`}
            >
              Place<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Hub</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span
            className={`font-extrabold tracking-widest uppercase text-emerald-700 leading-tight mt-0.5 ${
              size === "sm" ? "text-[8.5px]" : "text-[9.5px]"
            }`}
          >
            Campus Placements
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} title="PlaceHub Home" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
