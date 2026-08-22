"use client";

import { useState, useEffect } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminApplicationsTab } from "@/components/admin/AdminApplicationsTab";
import { AdminTutorsTab } from "@/components/admin/AdminTutorsTab";
import { AdminBookingsTab } from "@/components/admin/AdminBookingsTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

function AdminPage() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    totalBookings: 0,
    pendingApplications: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !admin) {
      throw redirect({ to: "/admin/login" });
    }
  }, [admin, authLoading]);

  useEffect(() => {
    if (!admin) return;

    const loadStats = async () => {
      setLoading(true);
      try {
        const { createServerClient } = await import("@/lib/supabase-server");
        const supabase = createServerClient();

        const [usersResult, tutorsResult, bookingsResult, applicationsResult] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("tutors").select("*", { count: "exact", head: true }),
          supabase.from("bookings").select("*", { count: "exact", head: true }),
          supabase.from("tutor_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        ]);

        setStats({
          totalUsers: usersResult.count || 0,
          totalTutors: tutorsResult.count || 0,
          totalBookings: bookingsResult.count || 0,
          pendingApplications: applicationsResult.count || 0,
          totalRevenue: 0,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [admin]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-crimson border-t-transparent" />
      </div>
    );
  }

  if (!admin) {
    throw redirect({ to: "/admin/login" });
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
              throw redirect({ to: "/admin/login" });
            }}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold sm:text-3xl">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Total Tutors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold sm:text-3xl">{stats.totalTutors}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold sm:text-3xl">{stats.totalBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-crimson sm:text-3xl">{stats.pendingApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mint sm:text-3xl">₹{stats.totalRevenue}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="applications" className="text-xs sm:text-sm">
              Applications
              {stats.pendingApplications > 0 && (
                <span className="ml-1.5 rounded-full bg-crimson px-2 py-0.5 text-[10px] font-bold text-white">
                  {stats.pendingApplications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="tutors" className="text-xs sm:text-sm">Tutors</TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs sm:text-sm">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminPanel onNavigate={setActiveTab} />
          </TabsContent>

          <TabsContent value="applications">
            <AdminApplicationsTab />
          </TabsContent>

          <TabsContent value="tutors">
            <AdminTutorsTab />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
