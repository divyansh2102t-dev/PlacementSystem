"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ParallaxCard } from "@/components/ui/ParallaxCard";
import { CompanyDrive } from "@/types";
import {
  Layers,
  CheckCircle2,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Terminal,
  UserCheck,
  Award,
  ChevronRight,
  GitBranch,
  Sparkles,
} from "lucide-react";

export default function PublicPipelinePage() {
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCompanies(data);
          setSelectedCompanyId(data[0].id);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const standardStages = [
    {
      step: "01",
      title: "Application & Eligibility Verification",
      icon: <FileCheck2 size={20} className="text-emerald-600" />,
      desc: "Students apply directly for corporate drives. Institutional rules verify CGPA thresholds, backlogs, branch eligibility, and graduation batch.",
    },
    {
      step: "02",
      title: "Resume Screening & Shortlisting",
      icon: <Users size={20} className="text-emerald-600" />,
      desc: "Talent acquisition teams and coordinators evaluate candidate profiles, verified projects, and technical skill alignments.",
    },
    {
      step: "03",
      title: "Online Assessment (OA)",
      icon: <Terminal size={20} className="text-emerald-600" />,
      desc: "Proctored technical assessments featuring algorithmic problem solving, domain-specific coding challenges, and quantitative aptitude.",
    },
    {
      step: "04",
      title: "Technical In-Depth Interviews",
      icon: <GitBranch size={20} className="text-emerald-600" />,
      desc: "One-on-one evaluations focusing on data structures, system architecture, core engineering fundamentals, and live problem breakdown.",
    },
    {
      step: "05",
      title: "Managerial & HR Fit",
      icon: <UserCheck size={20} className="text-emerald-600" />,
      desc: "Behavioral assessment evaluating organizational alignment, communication abilities, cross-functional collaboration, and leadership qualities.",
    },
    {
      step: "06",
      title: "Final Offer & Placement Confirmation",
      icon: <Award size={20} className="text-emerald-600" />,
      desc: "Letter of Intent (LOI) issued. The system automatically marks student records as 'Placed' with registered CTC details.",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800 mb-4">
                <Layers size={13} />
                <span>Multi-Tier Recruitment Architecture</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                The Campus Hiring Pipeline
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                A rigorous, multi-stage selection workflow designed to ensure complete transparency,
                fairness, and seamless coordination between university students and corporate recruiters.
              </p>
            </div>
          </div>
        </section>

        {/* 6-Stage Process Walkthrough */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl font-extrabold text-slate-900">
                End-to-End Selection Lifecycle
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Every applicant navigates progressive rounds. Advancement requires official confirmation from hiring coordinators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standardStages.map((stg) => (
                <ParallaxCard
                  key={stg.step}
                  maxTilt={8}
                  className="rounded-2xl h-full"
                >
                  <div className="h-full relative rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xs p-6 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 border border-emerald-100">
                        {stg.icon}
                      </div>
                      <span className="font-mono text-2xl font-black text-slate-200">
                        {stg.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {stg.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {stg.desc}
                    </p>
                  </div>
                </ParallaxCard>
              ))}
            </div>
          </div>
        </section>

        {/* Company-Specific Custom Stages Showcase */}
        <section className="border-t border-slate-200/80 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Dynamic Company Customization
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Live Custom Hiring Pipelines
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Recruiters can customize their selection stages with unique evaluation rounds (such as System Design, Case Studies, or Group Discussions).
                </p>
              </div>

              {/* Company Picker */}
              {companies.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {companies.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCompanyId(c.id)}
                      className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                        selectedCompany?.id === c.id
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {c.companyName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Company Pipeline Display */}
            {selectedCompany && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {selectedCompany.companyName} Recruitment Flow
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Role: {selectedCompany.roleTitle} · {selectedCompany.tier} Tier · Package: ₹{selectedCompany.ctcLpa} LPA
                    </p>
                  </div>
                  <Link
                    href={`/drives`}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    <span>View Drive Criteria</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Stages Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {(selectedCompany.stages && selectedCompany.stages.length > 0
                    ? selectedCompany.stages
                    : [
                        { id: "1", name: "Applied", order: 1 },
                        { id: "2", name: "Shortlisting", order: 2 },
                        { id: "3", name: "Online Assessment", order: 3 },
                        { id: "4", name: "Technical Interview", order: 4 },
                        { id: "5", name: "HR Interview", order: 5 },
                        { id: "6", name: "Hired", order: 6 },
                      ]
                  )
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((stg, i, arr) => (
                      <div
                        key={stg.id}
                        className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs relative"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-[11px] mx-auto mb-2">
                          {stg.order}
                        </span>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">
                          {stg.name}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">
                          Stage {stg.order} of {arr.length}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 md:py-16 bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Ready to Navigate Your Campus Placements?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Sign in to track real-time stage movements, assessment results, and verified interview schedules.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-sm hover:bg-emerald-400 transition"
              >
                Sign In to Portal
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
              >
                Student Registration
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

