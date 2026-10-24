"use client";

import React, { useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { downloadCsv } from "@/lib/utils";
import {
  Users,
  Search,
  Plus,
  KeyRound,
  Power,
  Shield,
  Download,
  Upload,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export function AdminUserManagement() {
  const { notify } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvText, setCsvText] = useState("");

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("student");

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleActive = async (user: User) => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, action: "toggleActive" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u))
      );
      notify(data.message);
    } catch (err: any) {
      notify(err.message || "Failed to update user status", "error");
    }
  };

  const handleResetPassword = async (user: User) => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, action: "resetPassword" }),
      });
      const data = await res.json();
      notify(data.message || `Password reset link sent to ${user.email}`);
    } catch (err: any) {
      notify("Failed to initiate password reset", "error");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers([data.user, ...users]);
      setIsAddUserModalOpen(false);
      setNewUserName("");
      setNewUserEmail("");
      notify(`User ${data.user.name} added!`);
    } catch (err: any) {
      notify(err.message || "Failed to add user", "error");
    }
  };

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Split CSV lines
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) {
        throw new Error("CSV must include a header and at least 1 record");
      }
      const headers = lines[0].split(",").map((h) => h.trim());
      const records = lines.slice(1).map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = parts[i] || "";
        });
        return obj;
      });

      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(records),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify(data.message || `Imported ${records.length} students!`);
      setIsImportModalOpen(false);
      setCsvText("");
      loadUsers();
    } catch (err: any) {
      notify(err.message || "CSV parse or import failed", "error");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admins Only</option>
            <option value="student">Students Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              downloadCsv("placehub-users-export.csv", filteredUsers)
            }
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Upload size={13} /> Import CSV
          </button>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition"
          >
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 dark:bg-slate-900 border-b dark:border-slate-800">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/70 transition dark:hover:bg-slate-800/40"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 text-xs">
                      {user.avatar || user.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      user.active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {user.active ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td className="p-3 text-slate-400 text-[11px]">
                  {user.createdAt}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      title="Reset Password"
                      onClick={() => handleResetPassword(user)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition"
                    >
                      <KeyRound size={14} />
                    </button>
                    <button
                      title={user.active ? "Deactivate User" : "Activate User"}
                      onClick={() => handleToggleActive(user)}
                      className={`rounded-lg p-1.5 transition ${
                        user.active
                          ? "text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          : "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      }`}
                    >
                      <Power size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: Add User */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add User to Placement Portal"
        subtitle="Create an administrator or student user account"
        icon={<Users size={18} />}
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              required
              placeholder="e.g. Prof. Rajesh Mehra"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Institutional Email
            </label>
            <input
              required
              type="email"
              placeholder="e.g. rajesh.mehra@college.edu"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">
              System Role
            </label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as UserRole)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="student">Student Portal</option>
              <option value="admin">Administrator (TPO Cell)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Import Students from CSV */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Students via CSV / Excel"
        subtitle="Bulk upload student roll numbers, CGPA, and departments"
        icon={<Upload size={18} />}
        maxWidth="lg"
      >
        <form onSubmit={handleCsvImport} className="space-y-3 text-xs">
          <p className="text-slate-500 leading-relaxed">
            Paste CSV formatted content with header: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">rollNo,name,email,department,cgpa,activeBacklogs</code>
          </p>

          <textarea
            rows={6}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`rollNo,name,email,department,cgpa,activeBacklogs\n21CS150,Aarush Gupta,aarush@placehub.edu,CSE,8.75,0\n21IT120,Neha Verma,neha@placehub.edu,IT,8.20,0`}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs dark:border-slate-700 dark:bg-slate-900"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
            >
              Import Students
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
