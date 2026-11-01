"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DbmsExplorer } from "@/components/admin/DbmsExplorer";

export default function AdminDbmsExplorerPage() {
  return (
    <DashboardLayout
      title="DBMS Relational Schema & Interactive SQL Explorer"
      subtitle="Examine Third Normal Form (3NF) relational tables, foreign keys, triggers, and execute SQL queries"
    >
      <DbmsExplorer />
    </DashboardLayout>
  );
}
