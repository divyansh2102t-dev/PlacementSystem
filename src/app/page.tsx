"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getClientUser } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getClientUser();
    if (user.role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/student/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8eedf] dark:bg-slate-950 font-sans">
      <div className="flex flex-col items-center gap-3 text-slate-700 dark:text-slate-200">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#252a27] text-lg font-black text-emerald-300 shadow">
          P
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <span>Directing to PlaceHub Portal...</span>
        </div>
      </div>
    </div>
  );
}
