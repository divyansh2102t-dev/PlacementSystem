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

  const handleToggleRole = async (user: User) => {
    const newRole: UserRole = user.role === "admin" ? "student" : "admin";
    if (
      !confirm(
        `Are you sure you want to grant ${newRole === "admin" ? "Administrator" : "Student"} access to ${user.name}?`
      )
    )
      return;
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, action: "changeRole", role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      notify(data.message);
    } catch (err: any) {
      notify(err.message || "Failed to update role", "error");
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-slate-200/80 bg-white/90 py-2 pl-8.5 pr-3 text-xs text-slate-800 shadow-2xs focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
            className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white hover:text-emerald-700 hover:border-emerald-300 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white hover:text-emerald-700 hover:border-emerald-300 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all"
          >
            <Upload size={13} /> Import CSV
          </button>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-emerald-700 hover:to-teal-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200/60">
            <tr>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Created</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-emerald-50/40 transition-colors"
              >
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 font-extrabold text-emerald-900 border border-emerald-200 text-xs shadow-2xs">
                      {user.avatar || user.name[0]}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase border ${
                      user.role === "admin"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {user.role === "admin" ? <Shield size={10} /> : <UserCheck size={10} />}
                    {user.role}
                  </span>
                </td>
                <td className="p-3.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      user.active ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.active ? "bg-emerald-500 animate-pulse" : "bg-rose-400"
                      }`}
                    />
                    {user.active ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td className="p-3.5 text-slate-400 text-[11px] font-medium">
                  {user.createdAt ? user.createdAt.split("T")[0] : "Active"}
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      title={user.role === "admin" ? "Demote to Student" : "Grant Administrator Access"}
                      onClick={() => handleToggleRole(user)}
                      className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all shadow-2xs border ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 hover:-translate-y-0.5"
                      }`}
                    >
                      <Shield size={12} />
                      <span>{user.role === "admin" ? "Admin" : "Make Admin"}</span>
                    </button>
                    <button
                      title="Reset Password"
                      onClick={() => handleResetPassword(user)}
                      className="rounded-xl p-1.5 text-slate-400 hover:bg-white hover:border-slate-200 border border-transparent hover:text-slate-700 transition shadow-2xs hover:-translate-y-0.5"
                    >
                      <KeyRound size={14} />
                    </button>
                    <button
                      title={user.active ? "Deactivate User" : "Activate User"}
                      onClick={() => handleToggleActive(user)}
                      className={`rounded-xl p-1.5 transition shadow-2xs border border-transparent hover:-translate-y-0.5 ${
                        user.active
                          ? "text-emerald-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                          : "text-rose-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
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
        icon={<Users size={18} className="text-emerald-600" />}
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700">
              Full Name
            </label>
            <input
              required
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white/95 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">
              Institutional Email
            </label>
            <input
              required
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white/95 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">
              System Role
            </label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as UserRole)}
              className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white/95 p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
            >
              <option value="student">Student Portal</option>
              <option value="admin">Administrator (TPO Cell)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition"
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
        icon={<Upload size={18} className="text-emerald-600" />}
        maxWidth="lg"
      >
        <form onSubmit={handleCsvImport} className="space-y-3.5 text-xs">
          <p className="text-slate-500 leading-relaxed font-medium">
            Paste CSV formatted content with header: <code className="bg-slate-100 px-1.5 py-0.5 rounded-lg text-emerald-800 font-mono text-[11px]">rollNo,name,email,department,cgpa,activeBacklogs</code>
          </p>

          <textarea
            rows={6}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
          />

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition"
            >
              Import Students
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
