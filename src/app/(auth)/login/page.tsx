"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setClientUser } from "@/lib/auth";
import { initialUsers } from "@/data/seedData";
import { useToast } from "@/components/ui/Toast";
import { Logo } from "@/components/ui/Logo";
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  const handleQuickDemoLogin = (roleType: "admin" | "student") => {
    // Admin is index 0 (Tanisha Roy), student is index 1 (Aarav Sharma)
    const demoUser = roleType === "admin" ? initialUsers[0] : initialUsers[1];
    setClientUser(demoUser);
    notify(`Logged in as ${demoUser.name} (${demoUser.role.toUpperCase()})`);

    if (demoUser.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/student/dashboard");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-transparent p-4 font-sans text-slate-800">
      {/* Return to Homepage Button */}
      <div className="mb-4 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft size={15} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-6 shadow-sm sm:p-8">
        {/* Header with Clickable Logo */}
        <div className="text-center flex flex-col items-center">
          <Logo href="/" size="lg" showText={false} />
          <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
            Sign In to Place<span className="text-emerald-600">Hub</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            University Campus Placement Portal
          </p>
        </div>

        {/* 1-Click Demo Login Options */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-2.5">
            Quick 1-Click Demo Access
          </span>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("admin")}
              className="flex w-full items-center justify-between rounded-xl bg-white p-2.5 text-left border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition group shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    Demo Administrator
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Tanisha Roy · Placement Cell Head
                  </p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-700" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin("student")}
              className="flex w-full items-center justify-between rounded-xl bg-white p-2.5 text-left border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition group shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-teal-100 text-teal-800 font-bold text-xs">
                  <GraduationCap size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                    Demo Student (Candidate)
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Aarav Sharma · 21CS001 (CGPA 9.35)
                  </p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-teal-700" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-slate-200" />
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Or sign in with email
          </span>
          <div className="h-[1px] flex-1 bg-slate-200" />
        </div>

        {/* Manual Email Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700">
              College Email
            </label>
            <div className="relative mt-1">
              <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">
              Password
            </label>
            <div className="relative mt-1">
              <Lock size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Portal"}
          </button>
        </form>

        {/* Link to Signup */}
        <div className="mt-5 text-center text-xs text-slate-500">
          <span>Don't have an account yet? </span>
          <Link
            href="/signup"
            className="font-bold text-emerald-700 hover:text-emerald-800 transition"
          >
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
}
