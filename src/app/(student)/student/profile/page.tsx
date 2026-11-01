"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentProfileForm } from "@/components/student/StudentProfileForm";
import { Student } from "@/types";
import { getClientUser } from "@/lib/auth";

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStudent = async () => {
    try {
      const activeUser = getClientUser();
      const studentId = activeUser.studentId || 1;
      const res = await fetch(`/api/students?id=${studentId}`);
      const data = await res.json();
      if (!data.error) setStudent(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, []);

  return (
    <DashboardLayout
      title="Edit Student Profile & Credentials"
      subtitle="Keep your branch, CGPA, backlogs, skills, and resume updated as company eligibility directly computes from them"
    >
      {loading || !student ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <span>Loading verified profile data...</span>
          </div>
        </div>
      ) : (
        <StudentProfileForm
          initialStudent={student}
          onProfileUpdated={(updated) => setStudent(updated)}
        />
      )}
    </DashboardLayout>
  );
}
