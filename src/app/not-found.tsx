"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, LayoutDashboard, Briefcase, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 overflow-hidden">
      {/* 3D Floating Ambient Lighting Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic 404 Card */}
      <div className="relative z-10 w-full max-w-xl mx-auto text-center rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-8 sm:p-12 shadow-2xl transition-all duration-300 hover:shadow-emerald-500/10 hover:border-emerald-300/80">
        
        {/* Floating 3D Badge */}
        <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-100/90 to-teal-100/80 px-4 py-1.5 text-xs font-black text-emerald-800 border border-emerald-200/80 shadow-xs mb-6">
          <Compass size={14} className="text-emerald-700 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Error 404 · Navigation Route Not Found</span>
        </div>

        {/* Big 3D Styled 404 Number */}
        <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 drop-shadow-xs">
          404
        </h1>

        <h2 className="mt-4 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Lost in the Placement Horizon?
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The recruitment drive, candidate portal, or dashboard link you requested doesn't exist or may have been reorganized.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all"
          >
            <Home size={15} />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/student/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-300 shadow-xs active:scale-95 transition-all"
          >
            <LayoutDashboard size={15} />
            <span>Student Dashboard</span>
          </Link>

          <Link
            href="/drives"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-300 shadow-xs active:scale-95 transition-all"
          >
            <Briefcase size={15} />
            <span>Explore Drives</span>
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-700 transition"
          >
            <ArrowLeft size={13} />
            <span>Back to Previous Page</span>
          </button>
        </div>
      </div>
    </main>
  );
}

