"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="relative border-t border-slate-800 bg-slate-950 text-slate-400 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-950/30 blur-3xl rounded-full -z-10" />

      {/* Top Pre-Footer Announcement Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-medium">
              Official 2026-2027 Campus Recruitment Season is live across all branches.
            </span>
          </div>
          <Link
            href="/drives"
            className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>Browse Active Drives</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 font-black text-white text-base shadow-sm">
                P
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white leading-tight">
                  Place<span className="text-emerald-400">Hub</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                  Campus Placement Portal
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The university's centralized recruitment gateway connecting students with tier-1
              technology corporations and multinational employers. Automated academic eligibility,
              customized multi-round pipelines, and verified career outcomes.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                <ShieldCheck size={13} className="text-emerald-400" /> NAAC A++ Accredited
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-300">
                <Award size={13} className="text-emerald-400" /> NIRF Top 20 Institution
              </span>
            </div>
          </div>

          {/* Column 1: Recruitment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Recruitment Drives
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/drives"
                  className="hover:text-emerald-400 transition"
                >
                  All Campus Drives
                </Link>
              </li>
              <li>
                <Link
                  href="/drives?tier=Super+Dream"
                  className="hover:text-emerald-400 transition"
                >
                  Super Dream Tier (≥18 LPA)
                </Link>
              </li>
              <li>
                <Link
                  href="/pipeline"
                  className="hover:text-emerald-400 transition"
                >
                  6-Stage Selection Pipeline
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="hover:text-emerald-400 transition"
                >
                  Corporate Partners Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Analytics & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Insights & Policies
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/statistics"
                  className="hover:text-emerald-400 transition"
                >
                  Placement Statistics
                </Link>
              </li>
              <li>
                <Link
                  href="/about#policy"
                  className="hover:text-emerald-400 transition"
                >
                  One-Offer Policy Rules
                </Link>
              </li>
              <li>
                <Link
                  href="/about#policy"
                  className="hover:text-emerald-400 transition"
                >
                  Super Dream Upgrade Criteria
                </Link>
              </li>
              <li>
                <Link
                  href="/about#faqs"
                  className="hover:text-emerald-400 transition"
                >
                  Student Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Central Placement Cell */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Placement Directorate
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>Central T&P Complex, Block 4, University Campus</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-emerald-400 shrink-0" />
                <span>placements@university.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400 shrink-0" />
                <span>+91 (011) 2987-6543 / 44</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-emerald-400 shrink-0" />
                <span>Mon–Sat: 09:00 AM – 06:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} PlaceHub Central Placement Cell. All verified institutional rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/about" className="hover:text-slate-300 transition">
              Student Code of Conduct
            </Link>
            <Link href="/login" className="hover:text-slate-300 transition">
              Staff Portal Access
            </Link>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 size={13} />
              Portal Status: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
