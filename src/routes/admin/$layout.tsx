"use client";

import { Outlet } from "@tanstack/react-router";
import { AdminAuthProvider } from "@/lib/admin-auth";

export function AdminLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}
