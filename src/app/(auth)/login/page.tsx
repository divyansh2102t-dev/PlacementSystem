"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setClientUser } from "@/lib/auth";
import { initialUsers } from "@/data/seedData";
import { useToast } from "@/components/ui/Toast";
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Database,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setClientUser(data.user);
      notify(`Welcome back, ${data.user.name}!`);

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      notify(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (userIndex: number) => {
    const demoUser = initialUsers[userIndex];
    setClientUser(demoUser);
    notify(`Logged in as ${demoUser.name} (${demoUser.role.toUpperCase()})`);

    if (demoUser.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/student/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8eedf] p-4 font-sans text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-md rounded-[22px] border-[3px] border-[#252a27] bg-[#f4f5ec] p-6 shadow-[0_8px_0_rgba(20,40,30,0.06)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#252a27] text-lg font-black text-emerald-300 shadow">
            P
          </div>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            PlaceHub Portal
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Campus Placement Management System · RDBMS MySQL 8.0 3NF
          </p>
        </div>

        {/* Quick 1-Click Demo Login Roles */}
        <div className="mt-6 rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-2.5">
            <Sparkles size={12} className="text-emerald-600" />
            Quick 1-Click Demo Logins
          </span>

          <div className="space-y-2">
            <button
              onClick={() => handleQuickDemoLogin(0)}
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-2.5 text-left hover:bg-emerald-50 hover:border-emerald-300 border border-transparent dark:bg-slate-900/60 dark:hover:bg-emerald-950/40 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 font-bold text-xs">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                    Administrator Login
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Tanisha Roy · Placement Cell Head
                  </p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-600" />
            </button>

            <button
              onClick={() => handleQuickDemoLogin(1)}
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-2.5 text-left hover:bg-emerald-50 hover:border-emerald-300 border border-transparent dark:bg-slate-900/60 dark:hover:bg-emerald-950/40 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                  <GraduationCap size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                    Student Login (Candidate)
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Aarav Sharma · 21CS001 (CGPA 9.35)
                  </p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Or sign in with email
          </span>
          <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Manual Email Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              College Email
            </label>
            <div className="relative mt-1">
              <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                required
                type="email"
                placeholder="admin@placehub.edu or student@placehub.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Portal"}
          </button>
        </form>

        {/* Security & RDBMS note */}
        <div className="mt-5 text-center text-[10px] text-slate-400">
          <p>Role automatically determines landing destination.</p>
          <p className="mt-0.5">Students ➔ User Panel · Admins ➔ TPO Management Panel</p>
        </div>
      </div>
    </div>
  );
}
