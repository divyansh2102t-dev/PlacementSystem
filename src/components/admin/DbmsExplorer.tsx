"use client";

import React, { useState } from "react";
import { Database, RefreshCw, Sparkles, CheckCircle2, FileText } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const initialQueries = [
  {
    id: 1,
    title: "Eligible Students for Super Dream Drives (CGPA >= 8.5)",
    sql: `SELECT roll_no, name, department, cgpa, status
FROM students
WHERE cgpa >= 8.50 AND active_backlogs = 0
ORDER BY cgpa DESC;`,
  },
  {
    id: 2,
    title: "Branch-Wise Placement Summary & Highest CTC",
    sql: `SELECT department, 
       COUNT(id) AS total_students,
       SUM(CASE WHEN status = 'Placed' THEN 1 ELSE 0 END) AS placed_count,
       ROUND(AVG(highest_offer_lpa), 2) AS avg_placed_ctc,
       MAX(highest_offer_lpa) AS max_ctc
FROM students
GROUP BY department
ORDER BY placed_count DESC;`,
  },
  {
    id: 3,
    title: "Companies with Top Applications & CTC",
    sql: `SELECT c.company_name, c.tier, c.role_title, c.ctc_lpa, COUNT(a.id) AS total_applicants
FROM companies c
LEFT JOIN applications a ON c.id = a.drive_id
GROUP BY c.id, c.company_name, c.tier, c.role_title, c.ctc_lpa
ORDER BY c.ctc_lpa DESC;`,
  },
  {
    id: 4,
    title: "Live Application Pipeline by Stage",
    sql: `SELECT a.stage, COUNT(a.id) AS count,
       ROUND(AVG(a.ctc_lpa), 2) AS avg_package_lpa
FROM applications a
GROUP BY a.stage
ORDER BY count DESC;`,
  },
  {
    id: 5,
    title: "View: Branch-wise Placement Stats",
    sql: `SELECT * FROM vw_branch_wise_placement_stats;`,
  },
  {
    id: 6,
    title: "View: Top Placed Students Summary",
    sql: `SELECT * FROM vw_placed_students_summary ORDER BY cgpa DESC LIMIT 10;`,
  },
];

export function DbmsExplorer() {
  const { notify } = useToast();
  const [selectedTable, setSelectedTable] = useState("students");
  const [activeQuerySql, setActiveQuerySql] = useState(initialQueries[0].sql);
  const [executionMessage, setExecutionMessage] = useState(
    "Ready to run query against Neon PostgreSQL (neondb) · Queries are saved to dbms/executed_queries.sql"
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<{
    fields: string[];
    rows: any[];
    rowCount: number;
    executionTimeMs?: number;
  } | null>(null);

  const schemaTables = [
    {
      name: "students",
      records: 50,
      columns: [
        { name: "id", type: "INT PRIMARY KEY", key: "PK" },
        { name: "roll_no", type: "VARCHAR(20) UNIQUE", key: "UK" },
        { name: "name", type: "VARCHAR(100)", key: "" },
        { name: "email", type: "VARCHAR(120) UNIQUE", key: "UK" },
        { name: "department", type: "VARCHAR(20)", key: "" },
        { name: "cgpa", type: "NUMERIC(4,2) CHECK (cgpa <= 10.0)", key: "" },
        { name: "active_backlogs", type: "INT DEFAULT 0", key: "" },
        { name: "skills", type: "JSONB", key: "" },
        { name: "status", type: "VARCHAR(30)", key: "" },
        { name: "highest_offer_lpa", type: "NUMERIC(6,2)", key: "" },
      ],
    },
    {
      name: "companies",
      records: 10,
      columns: [
        { name: "id", type: "INT PRIMARY KEY", key: "PK" },
        { name: "company_name", type: "VARCHAR(120)", key: "" },
        { name: "industry", type: "VARCHAR(100)", key: "" },
        { name: "tier", type: "VARCHAR(30)", key: "" },
        { name: "role_title", type: "VARCHAR(120)", key: "" },
        { name: "ctc_lpa", type: "NUMERIC(6,2)", key: "" },
        { name: "min_cgpa", type: "NUMERIC(4,2)", key: "" },
        { name: "eligible_depts", type: "JSONB", key: "" },
        { name: "drive_date", type: "DATE", key: "" },
      ],
    },
    {
      name: "applications",
      records: 16,
      columns: [
        { name: "id", type: "INT PRIMARY KEY", key: "PK" },
        { name: "student_id", type: "INT REFERENCES students(id)", key: "FK" },
        { name: "drive_id", type: "INT REFERENCES companies(id)", key: "FK" },
        { name: "student_name", type: "VARCHAR(100)", key: "" },
        { name: "stage", type: "VARCHAR(40)", key: "" },
        { name: "applied_date", type: "DATE", key: "" },
        { name: "history", type: "JSONB", key: "" },
      ],
    },
    {
      name: "users",
      records: 5,
      columns: [
        { name: "id", type: "INT PRIMARY KEY", key: "PK" },
        { name: "name", type: "VARCHAR(100)", key: "" },
        { name: "email", type: "VARCHAR(120) UNIQUE", key: "UK" },
        { name: "role", type: "VARCHAR(20)", key: "" },
        { name: "active", type: "BOOLEAN", key: "" },
      ],
    },
  ];

  const handleRunQuery = async () => {
    setIsExecuting(true);
    setExecutionMessage("Executing on Neon PostgreSQL...");
    try {
      const res = await fetch("/api/dbms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuerySql }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setExecutionMessage(`Execution Error: ${data.error || "Unknown query error"}`);
        notify(data.error || "Query failed", "error");
      } else {
        setQueryResult({
          fields: data.fields || [],
          rows: data.rows || [],
          rowCount: data.rowCount,
          executionTimeMs: data.executionTimeMs,
        });
        setExecutionMessage(
          `✓ Executed on Neon in ${data.executionTimeMs}ms · ${data.rowCount} tuples returned · Query logged to dbms/executed_queries.sql`
        );
        notify("SQL Query executed successfully on Neon PostgreSQL!");
      }
    } catch (err: any) {
      setExecutionMessage(`Network Error: ${err.message}`);
      notify("Failed to reach database API", "error");
    } finally {
      setIsExecuting(false);
    }
  };

  const currentTableMeta = schemaTables.find((t) => t.name === selectedTable);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="rounded-2xl bg-[#1b2621] p-4 text-white shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Database size={20} className="text-emerald-400 shrink-0" />
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                DBMS Relational Architecture & Interactive SQL Query Runner
              </h2>
              <p className="text-xs text-emerald-200/70">
                Connected to <span className="font-mono text-emerald-300">Neon PostgreSQL (neondb)</span> · All executed queries are automatically logged to <span className="font-mono text-emerald-300">dbms/executed_queries.sql</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-900/80 px-3 py-1 text-[11px] font-mono text-emerald-300 border border-emerald-700/60">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Neon Live Connected
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Schema Tables */}
        <div className="space-y-3 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              PostgreSQL Tables (Relational 3NF)
            </h3>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-2">
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
                  <span className="text-[10px] opacity-70">{t.records} records in Neon</span>
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
                              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                DBMS Evaluation Queries (Click to load)
              </h3>
              <span className="text-[10px] text-slate-400">Live PostgreSQL Engine</span>
            </div>

            {/* Quick Queries */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {initialQueries.map((q) => (
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
                <span>Dialect: PostgreSQL (Neon)</span>
              </div>
              <textarea
                rows={5}
                value={activeQuerySql}
                onChange={(e) => setActiveQuerySql(e.target.value)}
                className="w-full bg-transparent text-emerald-300 outline-none resize-none font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold truncate max-w-sm">
                {executionMessage}
              </span>
              <button
                disabled={isExecuting}
                onClick={handleRunQuery}
                className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition disabled:opacity-50 shrink-0"
              >
                <RefreshCw size={13} className={isExecuting ? "animate-spin" : ""} />
                <span>Execute on Neon</span>
              </button>
            </div>

            {/* Live Results Table */}
            <div className="mt-4 rounded-xl border border-slate-200/80 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-100 p-2.5 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300 flex items-center justify-between">
                <span>
                  Query Results {queryResult ? `(${queryResult.rowCount} tuples returned)` : "(Ready)"}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 size={12} /> Logged in dbms/executed_queries.sql
                </span>
              </div>
              <div className="p-3 text-xs overflow-x-auto bg-slate-50/50 dark:bg-slate-900/40 max-h-72">
                {queryResult && queryResult.rows.length > 0 ? (
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="border-b text-[10px] uppercase text-slate-400">
                        {queryResult.fields.map((field) => (
                          <th key={field} className="pb-1.5 pr-4 whitespace-nowrap">
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {queryResult.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/60">
                          {queryResult.fields.map((field) => (
                            <td key={field} className="py-1.5 pr-4 whitespace-nowrap">
                              {typeof row[field] === "object" && row[field] !== null
                                ? JSON.stringify(row[field])
                                : String(row[field] ?? "—")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-slate-400 text-center py-4">
                    {queryResult
                      ? "Query executed successfully with 0 rows returned."
                      : "Click 'Execute on Neon' to run the SQL query above."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
