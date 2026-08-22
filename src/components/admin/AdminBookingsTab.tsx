"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: string;
  user_id: string;
  tutor_id: string;
  tutor_name: string;
  tutor_subject: string;
  student_name: string;
  student_phone: string;
  student_email: string;
  mode: string;
  date: string;
  time: string;
  tuition_type: string;
  status: string;
  payment_status: string;
  amount: number;
  payment_id: string;
  razorpay_order_id: string;
  order_id: string;
  created_at: string;
  updated_at: string;
}

export function AdminBookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadBookings = async () => {
    try {
      console.log("[admin] loading bookings", {
        url: import.meta.env.VITE_SUPABASE_URL,
        hasKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Loading timed out")), 10000)
      );
      const queryPromise = supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      const result = await Promise.race([queryPromise, timeoutPromise]);
      console.log("[admin] bookings result", result);
      const { data, error } = result;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      if (error && typeof error === "object" && "message" in error) {
        console.error("[admin] bookings error message", (error as { message?: string }).message);
      }
      if (error && typeof error === "object" && "status" in error) {
        console.error("[admin] bookings error status", (error as { status?: number }).status);
      }
      const message = error instanceof Error ? error.message : "Failed to load bookings";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      !searchQuery ||
      booking.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tutor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.student_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-mint/15 text-mint";
      case "pending":
        return "bg-crimson/15 text-crimson";
      case "cancelled":
        return "bg-destructive/15 text-destructive";
      case "completed":
        return "bg-mint/15 text-mint";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-mint/15 text-mint";
      case "pending":
        return "bg-crimson/15 text-crimson";
      case "failed":
        return "bg-destructive/15 text-destructive";
      case "refunded":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-crimson border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Bookings</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-sm sm:w-80"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-sm sm:w-40"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings found</p>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-lg border-2 border-border bg-card p-4 sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-display text-base font-bold sm:text-lg">
                          {booking.tutor_name}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getPaymentStatusColor(
                            booking.payment_status
                          )}`}
                        >
                          {booking.payment_status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:text-sm">
                        <div>
                          <span className="text-muted-foreground">Student:</span>{" "}
                          {booking.student_name}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>{" "}
                          {booking.student_email}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>{" "}
                          {booking.student_phone}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Subject:</span>{" "}
                          {booking.tutor_subject}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mode:</span>{" "}
                          {booking.mode}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>{" "}
                          {booking.date || "Not set"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>{" "}
                          {booking.time || "Not set"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>{" "}
                          ₹{booking.amount}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>{" "}
                          {booking.tuition_type || "Not specified"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>{" "}
                          {new Date(booking.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
