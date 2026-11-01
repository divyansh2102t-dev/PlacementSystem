"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { CompanyDrive } from "@/types";
import { TierBadge } from "@/components/ui/Badge";
import { formatCurrencyLpa } from "@/lib/utils";
import {
  Building2,
  Users,
  ShieldCheck,
  Award,
  ArrowRight,
  Handshake,
  CheckCircle2,
  Mail,
  MapPin,
  Briefcase,
  MonitorCheck,
  CalendarCheck,
} from "lucide-react";

export default function PublicCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyDrive[]>([]);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCompanies(data);
      })
      .catch((e) => console.error(e));
  }, []);

  const corporateAdvantages = [
    {
      title: "Pre-Screened Talent Pool",
      desc: "All students undergo rigorous academic validation. Full historical CGPA and skill certifications verified before campus slots.",
      icon: <MonitorCheck size={20} className="text-emerald-600" />,
    },
    {
      title: "Seamless Drive Infrastructure",
      desc: "1,200+ high-speed proctored online testing terminals, 40 dedicated corporate interview suites, and video conferencing setups.",
      icon: <Building2 size={20} className="text-emerald-600" />,
    },
    {
      title: "Customizable Selection Stages",
      desc: "Design your bespoke hiring pipeline on our portal: insert coding assessments, technical interviews, and case presentation rounds.",
      icon: <CalendarCheck size={20} className="text-emerald-600" />,
    },
    {
      title: "Streamlined Slot Allocation",
      desc: "Day 0, Day 1, and Day 2 hiring priority slots allocated transparently based on student preference and compensation package tier.",
      icon: <Award size={20} className="text-emerald-600" />,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800 mb-4">
                <Handshake size={13} />
                <span>Corporate Partnerships & Recruiter Directory</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Our Partner Companies
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Over 120+ global technology corporations, banking institutions, and innovative enterprises
                actively recruit top engineering and research talent from our campus.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Advantages */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Why Global Leaders Hire From Us
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                End-to-end recruitment logistics, transparent candidate management, and world-class testing infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {corporateAdvantages.map((adv) => (
                <div
                  key={adv.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:border-emerald-300 transition duration-200"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 mb-4 border border-emerald-100">
                    {adv.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {adv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Active Recruiting Companies Directory */}
        <section className="border-t border-slate-200/80 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Featured Employers
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Active Campus Drives Directory
                </h2>
              </div>
              <Link
                href="/drives"
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
              >
                <span>View All Open Drive Deadlines</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-2xs hover:border-emerald-300 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 font-extrabold text-emerald-800 text-sm shadow-2xs border border-emerald-200/80">
                        {company.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">
                          {company.companyName}
                        </h3>
                        <span className="text-xs text-slate-500">
                          {company.industry}
                        </span>
                      </div>
                    </div>
                    <TierBadge tier={company.tier} />
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {company.description}
                  </p>

                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 mb-4 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-700">
                      <span>Role Offered:</span>
                      <span className="text-slate-900 font-bold">{company.roleTitle}</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-slate-700">
                      <span>Annual Package:</span>
                      <span className="text-emerald-700 font-extrabold">
                        {formatCurrencyLpa(company.ctcLpa)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 pt-3">
                    <span>Location: {company.location}</span>
                    <Link
                      href="/drives"
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      Drive Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Invite CTA */}
        <section className="py-12 md:py-16 bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Join Our Campus Recruitment Season
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Interested in Hiring From Our University?
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Connect directly with the Central Placement Office to register a recruitment drive, reserve priority interview dates, or conduct technical pre-placement talks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="mailto:placements@university.edu"
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-sm hover:bg-emerald-400 transition"
                >
                  <Mail size={14} />
                  <span>Email Placement Cell</span>
                </a>
                <Link
                  href="/about"
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                >
                  <span>Placement Guidelines</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

