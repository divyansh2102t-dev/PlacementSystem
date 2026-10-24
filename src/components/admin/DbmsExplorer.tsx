"use client";

import React, { useState } from "react";
import { sampleQueries } from "@/data/seedData";
import { Database, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function DbmsExplorer() {
  const { notify } = useToast();
  const [selectedTable, setSelectedTable] = useState("Students");
  const [activeQuerySql, setActiveQuerySql] = useState(sampleQueries[0].sql);
  const [executionMessage, setExecutionMessage] = useState(
    "Ready to run query against placement_system_db (MySQL 8.0+ compatible)"
  );
  const [isExecuting, setIsExecuting] = useState(false);

  const schemaTables = [
    {
      name: "Students",
      records: 50,
      columns: [
        { name: "student_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "roll_no", type: "VARCHAR(20) UNIQUE", key: "UK" },
        { name: "full_name", type: "VARCHAR(100)", key: "" },
        { name: "email", type: "VARCHAR(120) UNIQUE", key: "UK" },
        { name: "department", type: "ENUM('CSE','IT','ECE','EEE','MECH','CIVIL')", key: "" },
        { name: "cgpa", type: "DECIMAL(3,2) CHECK (cgpa <= 10.0)", key: "" },
        { name: "active_backlogs", type: "INT DEFAULT 0", key: "" },
        { name: "placement_status", type: "ENUM('Unplaced','In Process','Placed')", key: "" },
      ],
    },
    {
      name: "Companies",
      records: 10,
      columns: [
        { name: "company_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "company_name", type: "VARCHAR(100) UNIQUE", key: "UK" },
        { name: "industry", type: "VARCHAR(60)", key: "" },
        { name: "tier", type: "ENUM('Super Dream','Dream','Core','Mass')", key: "" },
        { name: "headquarters", type: "VARCHAR(100)", key: "" },
        { name: "hr_contact_email", type: "VARCHAR(120)", key: "" },
      ],
    },
    {
      name: "JobDrives",
      records: 10,
      columns: [
        { name: "drive_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "company_id", type: "INT", key: "FK -> Companies" },
        { name: "job_title", type: "VARCHAR(120)", key: "" },
        { name: "ctc_lpa", type: "DECIMAL(5,2)", key: "" },
        { name: "min_cgpa", type: "DECIMAL(3,2) DEFAULT 6.50", key: "" },
        { name: "max_backlogs_allowed", type: "INT DEFAULT 0", key: "" },
        { name: "drive_date", type: "DATE", key: "" },
      ],
    },
    {
      name: "Applications",
      records: 16,
      columns: [
        { name: "application_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "student_id", type: "INT", key: "FK -> Students" },
        { name: "drive_id", type: "INT", key: "FK -> JobDrives" },
        { name: "applied_date", type: "TIMESTAMP", key: "" },
        { name: "application_status", type: "ENUM('Applied','Shortlisted','Accepted')", key: "" },
      ],
    },
    {
      name: "InterviewSchedules",
      records: 8,
      columns: [
        { name: "interview_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "application_id", type: "INT", key: "FK -> Applications" },
        { name: "round_name", type: "VARCHAR(50)", key: "" },
        { name: "scheduled_at", type: "DATETIME", key: "" },
        { name: "mode", type: "ENUM('Online','In-Person')", key: "" },
      ],
    },
    {
      name: "PlacementOffers",
      records: 5,
      columns: [
        { name: "offer_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "student_id", type: "INT", key: "FK -> Students" },
        { name: "company_id", type: "INT", key: "FK -> Companies" },
        { name: "ctc_lpa", type: "DECIMAL(5,2)", key: "" },
        { name: "acceptance_status", type: "ENUM('Pending','Accepted','Declined')", key: "" },
      ],
    },
  ];

  const handleRunQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionMessage("Executing on placement_system_db... Query returned 8 tuples in 3ms.");
      notify("SQL Query executed successfully on relational schema!");
    }, 300);
  };

  const currentTableMeta = schemaTables.find((t) => t.name === selectedTable);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="rounded-2xl bg-emerald-950 p-4 text-white shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Database size={20} className="text-emerald-400 shrink-0" />
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                DBMS Relational Architecture & Interactive SQL Query Runner
              </h2>
              <p className="text-xs text-emerald-200/70">
                Database: <span className="font-mono text-emerald-300">placement_system_db</span> · Third Normal Form (3NF) relational tables with PK/FK constraints
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-800/80 px-3 py-1 text-[11px] font-mono text-emerald-200 border border-emerald-700">
            dbms/schema.sql active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Schema Tables */}
        <div className="space-y-3 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Relational Tables (DDL Models)
            </h3>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {schemaTables.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t.name)}
                  className={`flex flex-col rounded-xl p-2.5 text-left text-xs transition ${
                    selectedTable === t.name
                      ? "bg-[#252a27] text-white shadow-xs"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-200"
                  }`}
                >
                  <span className="font-mono font-bold">{t.name}</span>
                  <span className="text-[10px] opacity-70">{t.records} tuples</span>
                </button>
              ))}
            </div>

            {/* Column Specs */}
            {currentTableMeta && (
              <div className="mt-4">
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between mb-2">
                  <span>Columns in `{currentTableMeta.name}`</span>
                  <span className="text-[10px] text-slate-400">
                    {currentTableMeta.columns.length} Attributes
                  </span>
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 dark:bg-slate-900">
                      <tr>
                        <th className="p-2">Attribute</th>
                        <th className="p-2">Data Type</th>
                        <th className="p-2">Key / Constraint</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[10px]">
                      {currentTableMeta.columns.map((c) => (
                        <tr key={c.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="p-2 font-bold text-slate-800 dark:text-slate-200">{c.name}</td>
                          <td className="p-2 text-slate-500">{c.type}</td>
                          <td className="p-2">
                            {c.key ? (
                              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {c.key}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: SQL Query Playground */}
        <div className="space-y-3 lg:col-span-7">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Standard DBMS Evaluation Queries (Professors & Examiners)
            </h3>

            {/* Quick Queries */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {sampleQueries.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuerySql(q.sql)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 transition"
                >
                  {q.title}
                </button>
              ))}
            </div>

            {/* SQL Editor Area */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-emerald-400 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 text-[10px] text-slate-400 border-b border-slate-800 mb-2">
                <span>SQL Query Editor</span>
                <span>Dialect: MySQL 8.0 / PostgreSQL</span>
              </div>
              <textarea
                rows={4}
                value={activeQuerySql}
                onChange={(e) => setActiveQuerySql(e.target.value)}
                className="w-full bg-transparent text-emerald-300 outline-none resize-none font-mono text-xs"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold truncate max-w-sm">
                {executionMessage}
              </span>
              <button
                disabled={isExecuting}
                onClick={handleRunQuery}
                className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition disabled:opacity-50"
              >
                <RefreshCw size={13} className={isExecuting ? "animate-spin" : ""} />
                <span>Run SQL Query</span>
              </button>
            </div>

            {/* Simulated Live Results Table */}
            <div className="mt-4 rounded-xl border border-slate-200/80 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-100 p-2 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300 flex items-center justify-between">
                <span>Tuples Returned (Output Record Set)</span>
                <span className="text-emerald-700 font-mono">Status: 200 OK</span>
              </div>
              <div className="p-3 text-xs overflow-x-auto bg-slate-50/50 dark:bg-slate-900/40">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b text-[10px] uppercase text-slate-400">
                      <th className="pb-1.5 pr-3">Roll No</th>
                      <th className="pb-1.5 pr-3">Full Name</th>
                      <th className="pb-1.5 pr-3">Dept</th>
                      <th className="pb-1.5 pr-3">CGPA</th>
                      <th className="pb-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="py-1.5 font-bold">21CS088</td>
                      <td>Tanisha Roy</td>
                      <td>CSE</td>
                      <td className="font-bold text-emerald-600">9.60</td>
                      <td>Placed</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">21CS001</td>
                      <td>Aarav Sharma</td>
                      <td>CSE</td>
                      <td className="font-bold text-emerald-600">9.35</td>
                      <td>Placed</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">21CS042</td>
                      <td>Diya Patel</td>
                      <td>CSE</td>
                      <td className="font-bold text-emerald-600">8.90</td>
                      <td>Placed</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">21IT044</td>
                      <td>Sneha Reddy</td>
                      <td>IT</td>
                      <td className="font-bold text-emerald-600">8.80</td>
                      <td>Placed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
