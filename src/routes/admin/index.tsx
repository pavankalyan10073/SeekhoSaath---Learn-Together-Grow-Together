"use client";

import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

function AdminPage() {
  const { admin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate({ to: "/admin/login" });
    }
    setReady(true);
  }, [admin, authLoading, navigate]);

  if (authLoading || !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-crimson border-t-transparent" />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container-px mx-auto max-w-7xl py-8 sm:py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Complete platform management and monitoring
            </p>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("admin_auth");
              navigate({ to: "/admin/login" });
            }}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>

        <AdminPanel />
      </main>
    </div>
  );
}
