"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import {
  GraduationCap,
  ShieldCheck,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  HelpCircle,
  Mail,
  Phone,
  Building,
} from "lucide-react";

export default function PublicAboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const policies = [
    {
      title: "One-Student One-Offer Policy",
      tag: "Core Rule",
      desc: "To provide equitable placement opportunities to all registered graduates, once a student accepts an offer in a particular tier, they are marked as 'Placed' and withdrawn from competing drives within that tier.",
    },
    {
      title: "Super Dream Upgrade Option",
      tag: "Upgrade Exception",
      desc: "Students who have secured an offer in Core (< ₹10 LPA) or Dream (₹10 - ₹18 LPA) tiers are granted up to two (2) attempts to interview for Super Dream companies offering ≥ ₹18.0 LPA.",
    },
    {
      title: "Mandatory Drive Attendance",
      tag: "Conduct",
      desc: "Registering for a campus drive commits the student to attend the Pre-Placement Talk (PPT), online cognitive tests, and scheduled interviews. Unexcused absence leads to temporary drive suspension.",
    },
    {
      title: "Zero Tolerance on Academic Integrity",
      tag: "Discipline",
      desc: "Any instance of malpractice during proctored coding assessments, impersonation, or misrepresentation of CGPA/backlog counts results in immediate permanent debarment from campus recruitment.",
    },
  ];

  const faqs = [
    {
      q: "How does the portal determine my eligibility for a recruitment drive?",
      a: "The portal automatically checks your verified academic profile (current CGPA, active backlog count, engineering branch, and graduation year) against the specific criteria set by the recruiting company. If you meet all institutional requirements, the Apply button becomes active.",
    },
    {
      q: "How do the dynamic hiring stages work during a drive?",
      a: "Each participating corporate partner defines their selection rounds (e.g. Applied ➔ Resume Shortlisting ➔ Online Assessment ➔ Technical Interview ➔ HR Interview ➔ Hired). As company evaluators submit round results, your status advances in real time, and only advancing candidates appear in subsequent stage rosters.",
    },
    {
      q: "Can I apply for another company if I am already placed?",
      a: "Under the university's placement guidelines, you can only apply for higher-tier companies if your current offer is below the Super Dream threshold (≥ ₹18.0 LPA). Once you secure a Super Dream offer, you have reached the pinnacle tier.",
    },
    {
      q: "How do I update my contact details, resume URL, or skills?",
      a: "Log in to your Student Dashboard and navigate to the 'My Profile' tab. You can update your resume link, phone number, and technical competencies. Changes reflect immediately in applicant lists submitted to recruiters.",
    },
    {
      q: "Where do I report clashes between campus drives and academic semester exams?",
      a: "The Central Placement Cell coordinates directly with the Office of the Controller of Examinations. Corporate drives are scheduled strictly during non-examination windows, and any unavoidable interview conflicts are accommodated with alternate slots.",
    },
  ];

  const team = [
    {
      name: "Dr. Arvind R. Sharma",
      role: "Head, Training & Placement Cell",
      dept: "Professor, Computer Science & Engineering",
    },
    {
      name: "Prof. Sunita Deshmukh",
      role: "Corporate Relations Lead",
      dept: "Associate Professor, Electronics Engineering",
    },
    {
      name: "Vikramaditya Rao",
      role: "Industry Outreach & Slot Coordinator",
      dept: "Central Placement Directorate",
    },
    {
      name: "Ananya Mukherjee",
      role: "Student Placement Secretary",
      dept: "Senior Undergraduate, CSE",
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
                <BookOpen size={13} />
                <span>Institutional Governance & Placement Office</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                About & Placement Guidelines
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                The Central Training & Placement Cell bridges academic excellence and high-impact
                professional careers. Discover our institutional framework, code of conduct, and leadership.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Overview */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 mb-4 font-bold border border-emerald-100">
                  <GraduationCap size={20} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">Our Mission</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To empower every qualified engineering and science student with access to premier global employment opportunities through transparent, automated recruitment processes.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 mb-4 font-bold border border-emerald-100">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">Integrity & Fairness</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time database validation guarantees that every shortlisting and offer adheres strictly to documented criteria, eliminating favoritism and manual bias.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 mb-4 font-bold border border-emerald-100">
                  <Award size={20} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">Excellence Benchmark</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Achieving a consistent 85%+ overall placement rate across disciplines, with top corporate recruiters returning annually for our industry-ready graduates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Policies */}
        <section id="policy" className="border-t border-slate-200/80 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Official Regulations
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Placement Code of Conduct & Policies
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                All registered candidates and participating recruiters are governed by the following institutional rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {policies.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="border-t border-slate-200/80 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Placement Directorate
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Cell Leadership & Coordinators
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-2xs"
                >
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 font-extrabold text-white text-lg mb-3 shadow-xs">
                    {member.name.split(" ")[1]?.[0] || member.name[0]}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{member.dept}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section id="faqs" className="border-t border-slate-200/80 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Help & Answers
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-800 hover:text-emerald-700 transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 shrink-0 ml-3 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white/50">
                        <p className="pt-3">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

