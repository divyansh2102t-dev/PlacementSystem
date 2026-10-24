"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { Users, UserCog } from "lucide-react";

export default function AdminStudentsPage() {
  const [activeTab, setActiveTab] = useState<"users" | "students">("users");

  return (
    <DashboardLayout
      title="User & Student Directory Management"
      subtitle="Manage university students, administrator credentials, access permissions, and bulk imports"
    >
      <div className="space-y-4">
        <AdminUserManagement />
      </div>
    </DashboardLayout>
  );
}
