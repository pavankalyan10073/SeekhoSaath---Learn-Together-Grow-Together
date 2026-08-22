"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Tutor {
  id: string;
  userId: string;
  name: string;
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
  state: string;
  district: string;
  city: string;
  pinCode: string;
  fullAddress: string;
  aadharFront: string;
  aadharBack: string;
  applicationDate: string;
  verified: boolean;
  rating: number;
  sessions: number;
  responseTime: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export function AdminTutorsTab() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadTutors = async () => {
    try {
      const res = await fetch("/api/app?action=tutors");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ statusMessage: "Failed to fetch tutors" }));
        throw new Error(errorData.statusMessage || "Failed to fetch tutors");
      }
      const result = await res.json();
      setTutors(result.data || []);
    } catch (error) {
      console.error("Failed to load tutors:", error);
      const message = error instanceof Error ? error.message : "Failed to load tutors";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const filteredTutors = tutors.filter((tutor) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tutor.name.toLowerCase().includes(query) ||
      tutor.email.toLowerCase().includes(query) ||
      tutor.location.toLowerCase().includes(query) ||
      tutor.subjectsToTeach.some((s) => s.toLowerCase().includes(query))
    );
  });

  const handleViewDetails = (tutor: Tutor) => {
    alert(
      `Tutor Details:\n\n` +
      `Name: ${tutor.name}\n` +
      `Email: ${tutor.email}\n` +
      `Mobile: ${tutor.mobile}\n` +
      `Location: ${tutor.location}\n` +
      `Experience: ${tutor.experience}\n` +
      `Degree: ${tutor.degree} @ ${tutor.college}\n` +
      `Charge: ₹${tutor.chargePerSession}/session\n` +
      `Mode: ${tutor.teachingMode}\n` +
      `Rating: ${tutor.rating}\n` +
      `Sessions: ${tutor.sessions}\n` +
      `Status: ${tutor.status}`
    );
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
            <CardTitle>All Tutors</CardTitle>
            <input
              type="text"
              placeholder="Search tutors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-sm sm:w-80"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredTutors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tutors found</p>
          ) : (
            <div className="space-y-3">
              {filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex flex-col gap-3 rounded-lg border-2 border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {tutor.profilePic && (
                        <img
                          src={tutor.profilePic}
                          alt={tutor.name}
                          className="h-10 w-10 rounded-full object-cover border-2 border-border"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm sm:text-base">{tutor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tutor.email} • {tutor.mobile}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>📍 {tutor.location}</span>
                      <span>💰 ₹{tutor.chargePerSession}/session</span>
                      <span>⭐ {tutor.rating}</span>
                      <span>📚 {tutor.sessions} sessions</span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-bold ${
                          tutor.status === "approved"
                            ? "bg-mint/15 text-mint"
                            : tutor.status === "pending"
                            ? "bg-crimson/15 text-crimson"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {tutor.status}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewDetails(tutor)}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
