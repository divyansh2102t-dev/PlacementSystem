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
  User as UserIcon,
  BookOpen,
  Award,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [rollNo, setRollNo] = useState("");
  const [cgpa, setCgpa] = useState("8.5");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          department,
          rollNo,
          cgpa,
          phone,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setClientUser(data.user);
      notify(`Account created! Welcome, ${data.user.name}!`);

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      notify(err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleType: "admin" | "student") => {
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
            Create Your Account
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Join Place<span className="text-emerald-600">Hub</span> Campus Recruitment Portal
          </p>
        </div>

        {/* Quick Demo Options */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between mb-2">
            <span>Or try instantly with demo</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("admin")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition"
            >
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Demo Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("student")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition"
            >
              <GraduationCap size={14} className="text-teal-600" />
              <span>Demo Student</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-slate-200" />
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Registration Form
          </span>
          <div className="h-[1px] flex-1 bg-slate-200" />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700">Full Name</label>
            <div className="relative mt-1">
              <UserIcon size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                required
                type="text"
                placeholder="e.g. Diya Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Email Address</label>
            <div className="relative mt-1">
              <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                required
                type="email"
                placeholder="e.g. diya.patel@placehub.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-semibold text-slate-700">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none transition shadow-2xs"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Roll Number</label>
              <input
                type="text"
                placeholder="e.g. 21IT014"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-semibold text-slate-700">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="8.50"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none transition shadow-2xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none transition shadow-2xs"
              >
                <option value="student">Student (Candidate)</option>
                <option value="admin">Administrator (TPO)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Create Account & Sign In"}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-5 text-center text-xs text-slate-500">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="font-bold text-emerald-700 hover:text-emerald-800 transition"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

