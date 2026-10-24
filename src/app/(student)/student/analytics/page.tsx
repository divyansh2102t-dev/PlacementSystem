"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentAnalytics } from "@/components/student/StudentAnalytics";
import { Student, Application } from "@/types";
import { getClientUser } from "@/lib/auth";

export default function StudentAnalyticsPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeUser = getClientUser();
    const studentId = activeUser.studentId || 1;

    Promise.all([
      fetch(`/api/students?id=${studentId}`).then((r) => r.json()),
      fetch(`/api/applications?studentId=${studentId}`).then((r) => r.json()),
    ])
      .then(([sData, aData]) => {
        if (!sData.error) setStudent(sData);
        if (Array.isArray(aData)) setApplications(aData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout
      title="My Placement Analytics"
      subtitle="Evaluation progress, application breakdown, and profile competitiveness scoring"
    >
      {loading || !student ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <span>Calculating your analytics...</span>
          </div>
        </div>
      ) : (
        <StudentAnalytics student={student} applications={applications} />
      )}
    </DashboardLayout>
  );
}
