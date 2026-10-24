"use client";

import React, { useState } from "react";
import { Student, StudentDepartment } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { UserCheck, Upload, Save, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

interface StudentProfileFormProps {
  initialStudent: Student;
  onProfileUpdated?: (updated: Student) => void;
}

export function StudentProfileForm({
  initialStudent,
  onProfileUpdated,
}: StudentProfileFormProps) {
  const { notify } = useToast();
  const [student, setStudent] = useState<Student>(initialStudent);
  const [isSaving, setIsSaving] = useState(false);
  const [skillsInput, setSkillsInput] = useState(student.skills.join(", "));
  const [resumeName, setResumeName] = useState(
    student.resumeUrl ? student.resumeUrl.split("/").pop() || "Resume.pdf" : "No resume uploaded"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const skillsArray = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        department: student.department,
        batch: student.batch,
        cgpa: student.cgpa,
        activeBacklogs: student.activeBacklogs,
        skills: skillsArray,
        resumeUrl: `/resumes/${resumeName}`,
      };

      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setStudent(data.student);
      notify("Profile details updated! Company eligibility re-evaluated successfully.");
      if (onProfileUpdated) onProfileUpdated(data.student);
    } catch (err: any) {
      notify(err.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeName(file.name);
      notify(`Resume file selected: ${file.name}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-3xl rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800/90"
    >
      {/* Alert banner on live eligibility impact */}
      <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800/60">
        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Dynamic Drive Eligibility Linking</p>
          <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
            Updating your Department, CGPA, or Backlogs will instantly re-calculate your eligibility status across all 10 campus company recruitment drives.
          </p>
        </div>
      </div>

      {/* Row 1: Roll No & Full Name */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Roll Number (UK Constraint)
          </label>
          <input
            disabled
            value={student.rollNo}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-2 text-xs font-mono font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 cursor-not-allowed"
          />
          <span className="text-[9px] text-slate-400">Institutional Unique Key</span>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <input
            required
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            College Email
          </label>
          <input
            required
            type="email"
            value={student.email}
            onChange={(e) => setStudent({ ...student, email: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Phone Number
          </label>
          <input
            value={student.phone}
            onChange={(e) => setStudent({ ...student, phone: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Row 3: Department, CGPA, Backlogs, Batch (Directly governs eligibility!) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Department
          </label>
          <select
            value={student.department}
            onChange={(e) =>
              setStudent({ ...student, department: e.target.value as StudentDepartment })
            }
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
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
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Current CGPA
          </label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={student.cgpa}
            onChange={(e) => setStudent({ ...student, cgpa: parseFloat(e.target.value) || 0 })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Active Backlogs
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={student.activeBacklogs}
            onChange={(e) =>
              setStudent({ ...student, activeBacklogs: parseInt(e.target.value, 10) || 0 })
            }
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Graduating Batch
          </label>
          <input
            value={student.batch}
            onChange={(e) => setStudent({ ...student, batch: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Row 4: Technical Skills */}
      <div>
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          Technical Skills & Stacks (comma separated)
        </label>
        <input
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          placeholder="e.g. React, Next.js, Node.js, Python, PostgreSQL, Docker"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {skillsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              >
                {skill}
              </span>
            ))}
        </div>
      </div>

      {/* Row 5: Resume Upload Section */}
      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
        <Upload size={22} className="mx-auto text-emerald-600 mb-1" />
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Upload Verified Resume (PDF)
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Current file: <strong className="text-slate-700 dark:text-slate-300">{resumeName}</strong>
        </p>

        <label className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-200/80 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 cursor-pointer transition">
          <FileText size={13} />
          <span>Choose New File</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeSimulatedUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition disabled:opacity-50"
        >
          <Save size={14} />
          <span>{isSaving ? "Saving Updates..." : "Save Profile Details"}</span>
        </button>
      </div>
    </form>
  );
}
