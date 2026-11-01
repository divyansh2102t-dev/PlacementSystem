"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getClientUser } from "@/lib/auth";
import { User, CompanyDrive } from "@/types";
import {
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Layers,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);

  useEffect(() => {
    // Check if user is already logged in
    try {
      const user = getClientUser();
      if (user && user.email) {
        setCurrentUser(user);
      }
    } catch {
      // not logged in
    }

    // Fetch active companies for preview
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCompanies(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const dashboardHref =
    currentUser?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* =========================================================================
          NAVBAR
      ========================================================================== */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Clickable Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition group"
            title="PlaceHub Home"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 font-black text-white text-base shadow-sm group-hover:bg-emerald-700 transition">
              P
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition">
                PlaceHub
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-700">
                Placement Portal
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#drives" className="hover:text-emerald-700 transition">
              Recruitment Drives
            </a>
            <a href="#workflow" className="hover:text-emerald-700 transition">
              Hiring Pipeline
            </a>
            <a href="#stats" className="hover:text-emerald-700 transition">
              Placement Stats
            </a>
            <a href="#about" className="hover:text-emerald-700 transition">
              About
            </a>
          </div>

          {/* Right Action Button: Dynamic Login or Go to Dashboard */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-300 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                >
                  <span>Student Sign Up</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* =========================================================================
          HERO SECTION
      ========================================================================== */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Campus Recruitment Season 2026–2027</span>
            </div>

            {/* Headline */}
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight">
              Connect With Top Recruiters & Advance Through Every Round
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600">
              PlaceHub streamlines campus placements with real-time drive listings, personalized eligibility verification, customizable multi-stage recruitment pipelines, and complete application tracking.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href={currentUser ? dashboardHref : "/login"}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <span>{currentUser ? "Open Your Dashboard" : "Student & Admin Login"}</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="#drives"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-emerald-700 transition"
              >
                View Available Drives
              </a>
            </div>

            {/* Highlights Bar */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-slate-200/80 pt-8 text-left">
              <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Highest CTC
                </span>
                <p className="mt-1 text-2xl font-black text-emerald-700">₹34.0 LPA</p>
                <p className="text-[11px] text-slate-500">Google India (L3)</p>
              </div>

              <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Average Package
                </span>
                <p className="mt-1 text-2xl font-black text-slate-900">₹31.1 LPA</p>
                <p className="text-[11px] text-slate-500">Super Dream Offers</p>
              </div>

              <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Recruiters
                </span>
                <p className="mt-1 text-2xl font-black text-slate-900">3 Top Tier</p>
                <p className="text-[11px] text-slate-500">Verified & Hiring</p>
              </div>

              <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Stage Pipeline
                </span>
                <p className="mt-1 text-2xl font-black text-emerald-700">Real-Time</p>
                <p className="text-[11px] text-slate-500">Instant Stage Updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED RECRUITMENT DRIVES SECTION
      ========================================================================== */}
      <section id="drives" className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Verified Campus Opportunities
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Featured Recruitment Drives
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Apply directly through your student portal and track round-by-round progress.
              </p>
            </div>
            <Link
              href={currentUser ? dashboardHref : "/login"}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Explore all drives in portal</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((c) => (
              <div
                key={c.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 font-bold text-slate-800 text-sm border border-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                      {c.logo || c.companyName[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {c.companyName}
                      </h3>
                      <p className="text-[11px] text-slate-500">{c.location}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    {c.tier}
                  </span>
                </div>

                <div className="mt-4 flex-1">
                  <p className="text-xs font-bold text-slate-800">{c.roleTitle}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.eligibleDepts.map((d) => (
                      <span
                        key={d}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        {d}
                      </span>
                    ))}
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      Min CGPA {c.minCgpa}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Compensation
                    </span>
                    <p className="text-base font-black text-emerald-700">₹{c.ctcLpa} LPA</p>
                  </div>
                  <Link
                    href={currentUser ? dashboardHref : "/login"}
                    className="flex items-center gap-1 rounded-xl bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-600 hover:text-white transition"
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          DYNAMIC HIRING STAGES EXPLAINER
      ========================================================================== */}
      <section id="workflow" className="border-t border-slate-200 bg-slate-50/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              End-to-End Transparency
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Customizable Stage-by-Stage Hiring Pipeline
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Each company configures custom interview stages. As recruiters evaluate and advance candidates, applicants see live status updates in their dashboard.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-800">
                01
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Application & Eligibility</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Students apply with one click. Automatic eligibility verification validates CGPA, branch, and backlogs.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-100 text-xs font-black text-teal-800">
                02
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Shortlisting & Screening</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Placement officers and corporate recruiters review candidate profiles and advance shortlisted applicants to tests.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-100 text-xs font-black text-indigo-800">
                03
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Assessment & Technical Rounds</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Only students who clear previous rounds appear in subsequent stages, maintaining a clean, structured pipeline.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-800">
                04
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Final Offer & Hired</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Selected candidates receive their offer letter. Student profiles and placement records automatically sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
      ========================================================================== */}
      <footer id="about" className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 font-bold text-white text-xs">
                P
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">PlaceHub Campus Portal</p>
                <p className="text-xs text-slate-400">University Placement & Training Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <Link href="/login" className="hover:text-emerald-700 transition">
                Portal Sign In
              </Link>
              <span>·</span>
              <Link href="/signup" className="hover:text-emerald-700 transition">
                Candidate Registration
              </Link>
              <span>·</span>
              <span>Academic Year 2026–2027</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
