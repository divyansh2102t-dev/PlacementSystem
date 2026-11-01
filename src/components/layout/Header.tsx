"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  Sparkles,
} from "lucide-react";
import { User, Student } from "@/types";
import { clearClientUser } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";

interface HeaderProps {
  user: User;
  student?: Student | null;
  title: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
}

export function Header({ user, student, title, subtitle, onSearch }: HeaderProps) {
  const router = useRouter();
  const { notify } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const handleLogout = () => {
    clearClientUser();
    notify("Logged out successfully");
    router.push("/login");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div className="flex flex-col gap-2 pb-2">
      {/* Top Banner (Preserving original look & feel) */}
      <div className="flex items-center justify-between pb-1 text-[10px] font-semibold tracking-wider uppercase text-emerald-950/70 dark:text-emerald-400/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>CAMPUS PLACEMENT MANAGEMENT SYSTEM · PLACEHUB</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-block rounded bg-emerald-700/10 px-2 py-0.5 text-[9px] font-mono text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
            RDBMS: MySQL 8.0 3NF
          </span>
          <span className="hidden md:inline">ACADEMIC BATCH 2023–2027</span>
        </div>
      </div>

      {/* Main Toolbar */}
      <header className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-200/80 pb-2.5 dark:border-slate-800">
        {/* Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-[#e2e8da] dark:bg-slate-800 text-xs font-bold text-emerald-800 dark:text-emerald-400">
            ❖
          </span>
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative hidden md:flex items-center">
            <Search
              size={14}
              className="absolute left-3 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search companies, skills, students..."
              value={searchValue}
              onChange={handleSearchChange}
              className="h-8 w-48 lg:w-64 rounded-full border border-slate-300/80 bg-[#fffef9] pl-8 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            />
          </div>

          {/* Notifications Button */}
          <button
            aria-label="Notifications"
            onClick={() =>
              notify("Campus Drive Alert: 3 new companies added registration deadlines this week!")
            }
            className="relative grid h-8 w-8 place-items-center rounded-full border border-slate-300/80 bg-[#fffef9] text-slate-600 shadow-xs hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <Bell size={14} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            aria-label="Toggle Dark Mode"
            onClick={toggleDarkMode}
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-300/80 bg-[#fffef9] text-slate-600 shadow-xs hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 rounded-full border border-slate-300/80 bg-[#fffef9] py-1 pl-1.5 pr-3 shadow-xs dark:border-slate-700 dark:bg-slate-800">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-200 text-xs font-black text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100">
              {user.avatar || user.name[0]}
            </div>
            <div className="hidden sm:block text-left text-[11px] leading-tight">
              <p className="font-semibold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                {user.name}
              </p>
              <p className="text-[9px] text-slate-400">
                {user.role === "admin"
                  ? "Placement Cell Head"
                  : `${student?.department || "CSE"} · CGPA ${student?.cgpa || "8.5"}`}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-300/80 bg-[#fffef9] text-slate-600 shadow-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 transition"
          >
            <LogOut size={13} />
          </button>
        </div>
      </header>
    </div>
  );
}
