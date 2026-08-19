"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GOOGLE_SHEET_WEBHOOK = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK || "";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "";

const API_BASE = typeof window !== "undefined" ? "" : "";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function submitWithRetry(url: string, data: Record<string, unknown>, retries = MAX_RETRIES): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
        keepalive: true,
      });

      clearTimeout(timeoutId);

      if (response.ok) return response;

      if (i === retries - 1) return response;

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
    }
  }
  throw new Error("Max retries exceeded");
}

function validateIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
}

export function BookSessionDialog({
  open,
  onOpenChange,
  tutor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutor: { name: string; subj: string };
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    mode: "online" as "online" | "offline" | "hybrid",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (!validateIndianPhone(formData.phone)) {
      toast.error("Please enter a valid Indian phone number (10 digits starting with 6-9)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tutorName: tutor.name,
        tutorSubject: tutor.subj,
        type: "book_session",
        timestamp: new Date().toISOString(),
      };

      try {
        await submitWithRetry("/api/booking", payload);
      } catch {
        if (GOOGLE_SHEET_WEBHOOK) {
          await submitWithRetry(GOOGLE_SHEET_WEBHOOK, payload);
        }
      }

      const message = `Hi SeekhoSaath,%0AI would like to book a session with ${tutor.name} (${tutor.subj}).%0A%0AName: ${encodeURIComponent(formData.fullName)}%0APhone: ${formData.phone}%0AEmail: ${formData.email}%0AMode: ${formData.mode}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

      toast.success("Session request submitted! Redirecting to WhatsApp...");
      onOpenChange(false);
      setFormData({ fullName: "", phone: "", email: "", mode: "online" });
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
          <DialogDescription>
            Book a session with {tutor.name} ({tutor.subj})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="book-name">Full Name</Label>
            <Input
              id="book-name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="book-phone">Phone Number</Label>
            <Input
              id="book-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <Label htmlFor="book-email">Email</Label>
            <Input
              id="book-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label>Preferred Mode</Label>
            <RadioGroup value={formData.mode} onValueChange={(value: "online" | "offline" | "hybrid") => setFormData({ ...formData, mode: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offline" id="offline" />
                <Label htmlFor="offline">Offline</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid">Hybrid</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MeetingDialog({
  open,
  onOpenChange,
  tutor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutor: { name: string; subj: string };
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    tuitionType: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.tuitionType || !formData.date || !formData.time) {
      toast.error("Please fill all fields");
      return;
    }
    if (!validateIndianPhone(formData.phone)) {
      toast.error("Please enter a valid Indian phone number (10 digits starting with 6-9)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tutorName: tutor.name,
        tutorSubject: tutor.subj,
        type: "meeting",
        timestamp: new Date().toISOString(),
      };

      try {
        await submitWithRetry("/api/meeting", payload);
      } catch {
        if (GOOGLE_SHEET_WEBHOOK) {
          await submitWithRetry(GOOGLE_SHEET_WEBHOOK, payload);
        }
      }

      const message = `Hi SeekhoSaath,%0AI would like to schedule a meeting with ${tutor.name} (${tutor.subj}).%0A%0AName: ${encodeURIComponent(formData.fullName)}%0APhone: ${formData.phone}%0AEmail: ${formData.email}%0ATuition Type: ${formData.tuitionType}%0ADate: ${formData.date}%0ATime: ${formData.time}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

      toast.success("Meeting request submitted! Redirecting to WhatsApp...");
      onOpenChange(false);
      setFormData({ fullName: "", phone: "", email: "", tuitionType: "", date: "", time: "" });
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Meeting</DialogTitle>
          <DialogDescription>
            Schedule a meeting with {tutor.name} ({tutor.subj})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="meet-name">Full Name</Label>
            <Input
              id="meet-name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="meet-phone">Phone Number</Label>
            <Input
              id="meet-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <Label htmlFor="meet-email">Email</Label>
            <Input
              id="meet-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label htmlFor="tuition-type">Type of Tuition</Label>
            <Select value={formData.tuitionType} onValueChange={(value) => setFormData({ ...formData, tuitionType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select tuition type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online Tutoring</SelectItem>
                <SelectItem value="offline">Offline Tutoring</SelectItem>
                <SelectItem value="hybrid">Hybrid Tutoring</SelectItem>
                <SelectItem value="home">Home Tuition</SelectItem>
                <SelectItem value="group">Group Coaching</SelectItem>
                <SelectItem value="crash">Crash Course</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="meet-date">Date</Label>
              <Input
                id="meet-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="meet-time">Time</Label>
              <Input
                id="meet-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Send Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
