"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { CompanyDrive, CompanyTier, StudentDepartment } from "@/types";
import { Building2, Save } from "lucide-react";

interface AdminCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyToEdit?: CompanyDrive | null;
  onSave: (companyData: Partial<CompanyDrive>) => Promise<void>;
}

export function AdminCompanyModal({
  isOpen,
  onClose,
  companyToEdit,
  onSave,
}: AdminCompanyModalProps) {
  const [formData, setFormData] = useState<Partial<CompanyDrive>>({
    companyName: "",
    industry: "Technology",
    tier: "Dream",
    roleTitle: "",
    roleType: "Full-Time",
    ctcLpa: 12.0,
    stipendMonthly: 30000,
    location: "Bengaluru",
    minCgpa: 7.0,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "IT", "ECE"],
    eligibleBatch: "2027",
    requiredSkills: ["Data Structures", "Algorithms", "Java / Python"],
    deadline: "2026-12-30",
    driveDate: "2027-01-15",
    status: "Upcoming",
    description: "",
  });

  const [skillsString, setSkillsString] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (companyToEdit) {
      setFormData(companyToEdit);
      setSkillsString(companyToEdit.requiredSkills?.join(", ") || "");
    } else {
      setFormData({
        companyName: "",
        industry: "Technology",
        tier: "Dream",
        roleTitle: "",
        roleType: "Full-Time",
        ctcLpa: 12.0,
        stipendMonthly: 30000,
        location: "Bengaluru",
        minCgpa: 7.0,
        maxBacklogs: 0,
        eligibleDepts: ["CSE", "IT", "ECE"],
        eligibleBatch: "2027",
        requiredSkills: ["Data Structures", "Algorithms", "Java / Python"],
        deadline: "2026-12-30",
        driveDate: "2027-01-15",
        status: "Upcoming",
        description: "",
      });
      setSkillsString("Data Structures, Algorithms, Java / Python");
    }
  }, [companyToEdit, isOpen]);

  const allDepts: StudentDepartment[] = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];

  const handleDeptToggle = (dept: StudentDepartment) => {
    const current = formData.eligibleDepts || [];
    if (current.includes(dept)) {
      setFormData({ ...formData, eligibleDepts: current.filter((d) => d !== dept) });
    } else {
      setFormData({ ...formData, eligibleDepts: [...current, dept] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const skillsArray = skillsString
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await onSave({
        ...formData,
        requiredSkills: skillsArray,
        ctcLpa: parseFloat(String(formData.ctcLpa)) || 8.0,
        stipendMonthly: parseFloat(String(formData.stipendMonthly)) || 25000,
        minCgpa: parseFloat(String(formData.minCgpa)) || 6.5,
        maxBacklogs: parseInt(String(formData.maxBacklogs), 10) || 0,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={companyToEdit ? `Edit Drive: ${companyToEdit.companyName}` : "Create Recruitment Drive"}
      subtitle="Configure eligibility parameters, package tier, and drive dates"
      icon={<Building2 size={18} />}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Row 1: Company Name & Industry */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Company Name
            </label>
            <input
              required
              placeholder="e.g. Oracle Systems"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Industry / Business Domain
            </label>
            <input
              required
              placeholder="e.g. Enterprise Cloud & Database"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2: Role Title, Role Type, Tier */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Job Role Title
            </label>
            <input
              required
              placeholder="e.g. Software Engineer"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Recruitment Tier
            </label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value as CompanyTier })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none"
            >
              <option value="Super Dream">Super Dream (&gt; ₹20 LPA)</option>
              <option value="Dream">Dream (₹10 – ₹20 LPA)</option>
              <option value="Core">Core Engineering</option>
              <option value="Mass Recruiter">Mass Recruiter</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Employment Type
            </label>
            <select
              value={formData.roleType}
              onChange={(e) => setFormData({ ...formData, roleType: e.target.value as any })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Intern + PPO">Intern + PPO</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Row 3: Compensation & Location */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Package CTC (₹ LPA)
            </label>
            <input
              required
              type="number"
              step="0.1"
              value={formData.ctcLpa}
              onChange={(e) => setFormData({ ...formData, ctcLpa: parseFloat(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Monthly Stipend (₹)
            </label>
            <input
              type="number"
              value={formData.stipendMonthly}
              onChange={(e) =>
                setFormData({ ...formData, stipendMonthly: parseFloat(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Location
            </label>
            <input
              required
              placeholder="e.g. Bengaluru / Hyderabad"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 4: Eligibility Criteria (Min CGPA, Backlogs, Batch) */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/40 space-y-2.5">
          <span className="font-bold text-emerald-900 dark:text-emerald-300 text-[11px] uppercase tracking-wider">
            Institutional Eligibility Rules
          </span>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Minimum CGPA Cutoff
              </label>
              <input
                required
                type="number"
                step="0.05"
                min="0"
                max="10"
                value={formData.minCgpa}
                onChange={(e) => setFormData({ ...formData, minCgpa: parseFloat(e.target.value) || 0 })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Max Backlogs Allowed
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.maxBacklogs}
                onChange={(e) =>
                  setFormData({ ...formData, maxBacklogs: parseInt(e.target.value, 10) || 0 })
                }
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Target Graduating Batch
              </label>
              <input
                value={formData.eligibleBatch}
                onChange={(e) => setFormData({ ...formData, eligibleBatch: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Allowed Engineering Departments
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allDepts.map((d) => {
                const isSelected = formData.eligibleDepts?.includes(d);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => handleDeptToggle(d)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                      isSelected
                        ? "bg-[#252a27] text-white"
                        : "bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 5: Skills & Dates */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Registration Deadline
            </label>
            <input
              required
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Campus Drive Date
            </label>
            <input
              required
              type="date"
              value={formData.driveDate}
              onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Required Technical Skills (comma separated)
          </label>
          <input
            value={skillsString}
            onChange={(e) => setSkillsString(e.target.value)}
            placeholder="e.g. Data Structures, React, Golang, SQL, System Design"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Drive Description & Requirements
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Outline evaluation rounds, responsibilities, and instructions."
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition disabled:opacity-50"
          >
            <Save size={13} />
            <span>{isSaving ? "Saving..." : companyToEdit ? "Update Drive" : "Publish Drive"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
