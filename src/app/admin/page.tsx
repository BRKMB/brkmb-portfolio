"use client";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";

export default function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminDashboard />
    </AdminAuthGate>
  );
}
