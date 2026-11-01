"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut } from "lucide-react";
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
      {/* Top Status Strip */}
      <div className="flex items-center justify-between pb-1 text-[11px] font-semibold tracking-wider uppercase text-emerald-900/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>PlaceHub Campus Placement Portal</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-500 font-normal">
          <span>Batch 2023–2027</span>
          <span>·</span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
            Placement Active
          </span>
        </div>
      </div>

      {/* Main Toolbar */}
      <header className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-200 pb-2.5">
        {/* Title & Subtitle */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative hidden md:flex items-center">
            <Search
              size={14}
              className="absolute left-3 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search companies, drives, roles..."
              value={searchValue}
              onChange={handleSearchChange}
              className="h-8.5 w-48 lg:w-64 rounded-xl border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-xs"
            />
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1.5 pr-3 shadow-xs">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
              {user.avatar || user.name[0]}
            </div>
            <div className="text-left text-xs leading-tight">
              <p className="font-semibold text-slate-800 max-w-[120px] truncate">
                {user.name}
              </p>
              <p className="text-[10px] font-medium text-emerald-700 capitalize">
                {user.role === "admin"
                  ? "Placement Officer"
                  : `${student?.department || "Student"} · ${student?.rollNo || "Candidate"}`}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>
    </div>
  );
}
