"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminAnalyticsView } from "@/components/admin/AdminAnalyticsView";

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout
      title="Institutional Analytics & Reporting Desk"
      subtitle="Comprehensive university KPIs, department distributions, recruiter intakes, and website traffic"
    >
      <AdminAnalyticsView />
    </DashboardLayout>
  );
}
