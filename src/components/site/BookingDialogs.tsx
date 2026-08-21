"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const GOOGLE_SHEET_WEBHOOK = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK || "";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9391485316";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
const CASHFREE_SESSION_FORM = "https://payments.cashfree.com/forms/tutor-session";

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

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => void;
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
      theme?: {
        color: string;
      };
      modal?: {
        ondismiss?: () => void;
      };
    }) => {
      open: () => void;
      close: () => void;
    };
  }
}

async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined" || window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export function BookSessionDialog({
  open,
  onOpenChange,
  tutor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutor: { id: string; name: string; subj: string };
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    mode: "online" as "online" | "offline" | "hybrid",
    amount: "49",
  });
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.amount) {
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
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorSubject: tutor.subj,
        studentName: formData.fullName,
        studentPhone: formData.phone,
        studentEmail: formData.email,
        mode: formData.mode,
        amount: Number(formData.amount) * 100,
      };

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Booking creation failed:", res.status, text);
      } else {
        const result = await res.json();
        console.log("Booking created:", result);
        setBookingId(result.data?.bookingId || null);
      }

      setShowPayment(true);
    } catch (error) {
      console.error("Booking submit error:", error);
      setShowPayment(true);
    } finally {
      setLoading(false);
    }
  };

  const initializePayment = async () => {
    if (!formData.amount) {
      toast.error("Please select a session price");
      return;
    }

    window.location.href = CASHFREE_SESSION_FORM;
  };

  useEffect(() => {
    if (showPayment && formData.amount) {
      initializePayment();
    }
  }, [showPayment, formData.amount]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-sm mx-auto rounded-2xl sm:max-w-md sm:rounded-2xl z-[10000]">
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
          <DialogDescription>
            Book a session with {tutor.name} ({tutor.subj})
          </DialogDescription>
        </DialogHeader>
        {!showPayment ? (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
              <Label htmlFor="book-amount">Session Price</Label>
              <select
                id="book-amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
              >
                <option value="">Select amount</option>
                <option value="49">₹49</option>
                <option value="99">₹99</option>
                <option value="199">₹199</option>
              </select>
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
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </form>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-crimson border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Initializing secure payment...</p>
            <p className="text-xs text-muted-foreground mt-1">Please do not close this window</p>
          </div>
        )}
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
  tutor: { id: string; name: string; subj: string };
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

      const message = `Hi SeekhoSaath,%0AI would like to schedule a meeting with ${tutor.name} (${tutor.subj}).%0A%0AName: ${encodeURIComponent(formData.fullName)}%0APhone: ${encodeURIComponent(formData.phone)}%0AEmail: ${encodeURIComponent(formData.email)}%0ATuition Type: ${encodeURIComponent(formData.tuitionType)}%0ADate: ${encodeURIComponent(formData.date)}%0ATime: ${encodeURIComponent(formData.time)}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");

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
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-sm mx-auto rounded-2xl sm:max-w-md sm:rounded-2xl z-[10000]">
        <DialogHeader>
          <DialogTitle>Schedule a Meeting</DialogTitle>
          <DialogDescription>
            Schedule a meeting with {tutor.name} ({tutor.subj})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
            <select
              id="tuition-type"
              value={formData.tuitionType}
              onChange={(e) => setFormData({ ...formData, tuitionType: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            >
              <option value="">Select tuition type</option>
              <option value="online">Online Tutoring</option>
              <option value="offline">Offline Tutoring</option>
              <option value="hybrid">Hybrid Tutoring</option>
              <option value="home">Home Tuition</option>
              <option value="group">Group Coaching</option>
              <option value="crash">Crash Course</option>
            </select>
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

