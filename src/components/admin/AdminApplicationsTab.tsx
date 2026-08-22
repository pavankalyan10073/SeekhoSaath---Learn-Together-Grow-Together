"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface TutorApplication {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  mobile: string;
  profilePic: string;
  bio: string;
  experience: string;
  degree: string;
  college: string;
  yearOfPassing: string;
  specializations: string[];
  subjectsToTeach: string[];
  chargePerSession: string;
  teachingMode: "online" | "offline" | "hybrid";
  location: string;
  languages: string[];
  aadharFront: string;
  aadharBack: string;
  applicationDate: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export function AdminApplicationsTab() {
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("tutor_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Failed to load applications:", error);
      const message = error instanceof Error ? error.message : "Failed to load applications";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const { data: app } = await supabase.from("tutor_applications").select("*").eq("id", id).single();

      const tutorId = `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const { error: insertError } = await supabase.from("tutors").insert({
        id: tutorId,
        user_id: app.user_id,
        name: app.full_name,
        email: app.email,
        mobile: app.mobile,
        profile_pic: app.profile_pic,
        bio: app.bio,
        experience: app.experience,
        degree: app.degree,
        college: app.college,
        year_of_passing: app.year_of_passing,
        specializations: app.specializations || [],
        subjects_to_teach: app.subjects_to_teach || [],
        charge_per_session: app.charge_per_session,
        teaching_mode: app.teaching_mode,
        location: `${app.city}, ${app.district}, ${app.state}`,
        languages: app.languages || [],
        state: app.state,
        district: app.district,
        city: app.city,
        pin_code: app.pin_code,
        full_address: app.full_address,
        aadhar_front: app.aadhar_front,
        aadhar_back: app.aadhar_back,
        application_date: app.application_date,
        verified: true,
        rating: 0,
        sessions: 0,
        response_time: "< 1 hour",
        status: "approved",
      });

      if (insertError) throw insertError;

      await supabase.from("tutor_applications").update({ status: "approved", verified: true }).eq("id", id);
      toast.success("Tutor approved successfully");
      await loadApplications();
    } catch (error) {
      console.error("Failed to approve tutor:", error);
      toast.error("Failed to approve tutor");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    setActionLoading(id);
    try {
      const { error } = await supabase.from("tutor_applications").update({ status: "rejected", rejection_reason: reason }).eq("id", id);
      if (error) throw error;
      toast.success("Tutor application rejected");
      await loadApplications();
    } catch (error) {
      toast.error("Failed to reject tutor");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingApplications = applications.filter((a) => a.status === "pending");
  const processedApplications = applications.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Tutor Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading applications...</p>
          ) : pendingApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending applications</p>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border-2 border-border bg-card p-4 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {app.profilePic && (
                          <img
                            src={app.profilePic}
                            alt={app.fullName}
                            className="h-12 w-12 rounded-full object-cover border-2 border-border"
                          />
                        )}
                        <div>
                          <h3 className="font-display text-base font-bold sm:text-lg">
                            {app.fullName}
                          </h3>
                          <p className="text-xs text-muted-foreground sm:text-sm">
                            {app.email} • {app.mobile}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{app.bio}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {app.specializations.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-crimson/10 px-2.5 py-1 text-[11px] font-bold text-crimson"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>🎓 {app.degree} @ {app.college}</span>
                        <span>📅 {app.yearOfPassing}</span>
                        <span>💰 ₹{app.chargePerSession}/session</span>
                        <span>📍 {app.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <Button
                        onClick={() => handleApprove(app.id)}
                        disabled={actionLoading === app.id}
                        className="bg-mint hover:bg-mint/90 text-white"
                      >
                        {actionLoading === app.id ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        onClick={() => handleReject(app.id)}
                        disabled={actionLoading === app.id}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processed Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {processedApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No processed applications yet</p>
          ) : (
            <div className="space-y-3">
              {processedApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3 sm:p-4"
                >
                  <div>
                    <p className="font-medium text-sm sm:text-base">{app.fullName}</p>
                    <p className="text-xs text-muted-foreground">{app.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      app.status === "approved"
                        ? "bg-mint/15 text-mint"
                        : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
