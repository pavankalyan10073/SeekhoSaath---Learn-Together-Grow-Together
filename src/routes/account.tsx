import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth-context";
import { getTutorApplicationByEmail } from "@/lib/supabase-data";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Star,
  Clock,
  IndianRupee,
  Shield,
  FileText,
  GraduationCap,
  Settings,
  LogOut,
  ChevronRight,
  Award,
  Globe,
  MapPin,
  Calendar,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { OtpInput } from "@/components/ui/otp-input";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — SeekhoSaath" },
      { name: "description", content: "Manage your SeekhoSaath account and profile." },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

type EditModal = "name" | "email" | "phone" | null;

function AccountPage() {
  const { user, signOut, updateProfileName, updateProfileEmail, sendPhoneOTP, verifyPhoneOTP } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const [editModal, setEditModal] = useState<EditModal>(null);

  const [nameValue, setNameValue] = useState(user?.displayName || user?.email?.split("@")[0] || "");
  const [emailValue, setEmailValue] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [phoneValue, setPhoneValue] = useState("+91 ");
  const [otpValue, setOtpValue] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [isTutor, setIsTutor] = useState(false);
  const [tutorData, setTutorData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user?.email) return;
      const app = await getTutorApplicationByEmail(user.email);
      if (!mounted) return;
      if (app) {
        setIsTutor(app.verified);
        setTutorData(app);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user?.email]);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const openEdit = (type: EditModal) => {
    setNameValue(user?.displayName || user?.email?.split("@")[0] || "");
    setEmailValue(user?.email || "");
    setCurrentPassword("");
    setPhoneValue("+91 ");
    setOtpValue("");
    setVerificationId("");
    setOtpSent(false);
    setEditModal(type);
  };

  const closeEdit = () => {
    setEditModal(null);
    setOtpSent(false);
    setOtpValue("");
    setVerificationId("");
  };

  const handleSaveName = async () => {
    if (!nameValue.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await updateProfileName(nameValue.trim());
      toast.success("Name updated successfully");
      closeEdit();
    } catch {
      toast.error("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!emailValue.trim() || !currentPassword) {
      toast.error("Please enter new email and current password");
      return;
    }
    setLoading(true);
    try {
      await updateProfileEmail(currentPassword, emailValue.trim());
      toast.success("Email updated successfully. Please verify your new email.");
      closeEdit();
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Incorrect current password");
      } else if (code === "auth/email-already-in-use") {
        toast.error("This email is already in use");
      } else {
        toast.error("Failed to update email");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    const phone = phoneValue.replace(/\s+/g, "");
    if (phone.length < 13) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const result = await sendPhoneOTP(phone);
      setVerificationId(result.verificationId);
      setOtpSent(true);
      toast.success("OTP sent to your phone number");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/invalid-phone-number") {
        toast.error("Invalid phone number format");
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete OTP");
      return;
    }
    setLoading(true);
    try {
      await verifyPhoneOTP(verificationId, otpValue);
      toast.success("Phone number updated successfully");
      closeEdit();
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP. Please try again.");
      } else if (code === "auth/code-expired") {
        toast.error("OTP expired. Please resend.");
      } else {
        toast.error("Failed to verify OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14">
        <div className="bg-mesh absolute inset-0 -z-10 opacity-80" />
        <div
          aria-hidden
          className="absolute -top-16 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 rounded-full bg-crimson/20 blur-2xl sm:-top-20 sm:h-64 sm:w-64 sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-5xl">
          <div className="rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-br from-navy via-navy to-crimson/90 p-6 sm:p-8 md:p-10">
              <div className="absolute inset-0 bg-[url('/hero-tutor-rounded.jpg')] opacity-10 mix-blend-overlay" />
              <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="relative">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-crimson to-ember flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white shadow-[var(--shadow-glow)]">
                    {initial}
                  </div>
                  {isTutor && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-mint p-1.5 shadow-lg">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {displayName}
                  </h1>
                  <p className="mt-1 text-sm text-white/80 font-medium">
                    {user?.email}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                      isTutor 
                        ? "bg-mint/20 text-mint border border-mint/30" 
                        : "bg-white/10 text-white border border-white/20"
                    }`}>
                      {isTutor ? (
                        <>
                          <Award className="h-3.5 w-3.5" />
                          Verified Tutor
                        </>
                      ) : (
                        <>
                          <GraduationCap className="h-3.5 w-3.5" />
                          Student
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b-2 border-border">
              <div className="flex gap-1 px-4 sm:px-6 pt-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`relative px-4 py-3 text-sm font-extrabold transition-all ${
                    activeTab === "overview"
                      ? "text-crimson"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Overview
                  {activeTab === "overview" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-crimson to-ember"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`relative px-4 py-3 text-sm font-extrabold transition-all ${
                    activeTab === "settings"
                      ? "text-crimson"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Settings
                  {activeTab === "settings" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-crimson to-ember"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {isTutor && tutorData ? (
                    <>
                      {/* Tutor Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                          <Star className="h-5 w-5 sm:h-6 sm:w-6 text-ember mx-auto mb-2" />
                          <div className="text-lg sm:text-xl font-extrabold text-foreground">4.9</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Rating</div>
                        </div>
                        <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-crimson mx-auto mb-2" />
                          <div className="text-lg sm:text-xl font-extrabold text-foreground">120+</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Sessions</div>
                        </div>
                        <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                          <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-mint mx-auto mb-2" />
                          <div className="text-lg sm:text-xl font-extrabold text-foreground">{tutorData.chargePerSession || "₹699"}</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Per Session</div>
                        </div>
                        <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-navy mx-auto mb-2" />
                          <div className="text-lg sm:text-xl font-extrabold text-foreground">&lt; 1h</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Response</div>
                        </div>
                      </div>

                      {/* Tutor Details */}
                      <div className="rounded-2xl border-2 border-border bg-card p-5 sm:p-6 space-y-4">
                        <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
                          <User className="h-5 w-5 text-crimson" />
                          Professional Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Full Name</div>
                            <div className="text-sm font-extrabold text-foreground">{tutorData.fullName}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Email</div>
                            <div className="text-sm font-extrabold text-foreground">{tutorData.email}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Mobile</div>
                            <div className="text-sm font-extrabold text-foreground">{tutorData.mobile}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Experience</div>
                            <div className="text-sm font-extrabold text-foreground">{tutorData.experience}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Degree</div>
                            <div className="text-sm font-extrabold text-foreground">{tutorData.degree}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">College</div>
                            <div className="text-sm font-extrabold text-foreground">{tutorData.college}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Teaching Mode</div>
                            <div className="text-sm font-extrabold text-foreground capitalize">{tutorData.teachingMode}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Location</div>
                            <div className="text-sm font-extrabold text-foreground">
                              {[tutorData.state, tutorData.district, tutorData.city].filter(Boolean).join(", ") || "Not specified"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Specializations & Subjects */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl border-2 border-border bg-card p-5 sm:p-6">
                          <h3 className="font-display text-base font-extrabold text-foreground mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-crimson" />
                            Specializations
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {tutorData.specializations?.map((spec: string) => (
                              <span key={spec} className="rounded-full bg-primary-soft px-3 py-1 text-xs font-extrabold text-crimson">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-2xl border-2 border-border bg-card p-5 sm:p-6">
                          <h3 className="font-display text-base font-extrabold text-foreground mb-3 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-mint" />
                            Languages
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {tutorData.languages?.map((lang: string) => (
                              <span key={lang} className="rounded-full bg-mint/10 px-3 py-1 text-xs font-extrabold text-mint">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Student Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-crimson mx-auto mb-2" />
                          <div className="text-lg sm:text-xl font-extrabold text-foreground">3</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Courses</div>
                        </div>
                        <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-navy mx-auto mb-2" />
                          <div className="text-lg sm:text-xl font-extrabold text-foreground">12h</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Learning</div>
                        </div>
                        <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center col-span-2 sm:col-span-1">
                          <Star className="h-5 w-5 sm:h-6 sm:w-6 text-ember mx-auto mb-2" />
                          <div className="text-lg sm:text-xl font-extrabold text-foreground">4.8</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Avg Rating</div>
                        </div>
                      </div>

                      {/* Student Details */}
                      <div className="rounded-2xl border-2 border-border bg-card p-5 sm:p-6 space-y-4">
                        <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
                          <User className="h-5 w-5 text-crimson" />
                          Personal Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Full Name</div>
                            <div className="text-sm font-extrabold text-foreground">{displayName}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Email</div>
                            <div className="text-sm font-extrabold text-foreground">{user?.email}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Mobile</div>
                            <div className="text-sm font-extrabold text-foreground">+91 98765 43210</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Joined</div>
                            <div className="text-sm font-extrabold text-foreground">August 2026</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-border bg-card divide-y-2 divide-border">
                    <button
                      onClick={() => openEdit("name")}
                      className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary-soft p-2">
                          <User className="h-4 w-4 text-crimson" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-extrabold text-foreground">Full Name</div>
                          <div className="text-xs text-muted-foreground">{displayName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                    <button
                      onClick={() => openEdit("email")}
                      className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-mint/10 p-2">
                          <Mail className="h-4 w-4 text-mint" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-extrabold text-foreground">Email Address</div>
                          <div className="text-xs text-muted-foreground">{user?.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                    <button
                      onClick={() => openEdit("phone")}
                      className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-navy/10 p-2">
                          <Phone className="h-4 w-4 text-navy" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-extrabold text-foreground">Phone Number</div>
                          <div className="text-xs text-muted-foreground">+91 98765 43210</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-ember/10 p-2">
                          <Shield className="h-4 w-4 text-ember" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-extrabold text-foreground">Privacy & Security</div>
                          <div className="text-xs text-muted-foreground">Password, 2FA, and data settings</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-destructive/30 bg-destructive/5 px-4 py-3.5 text-sm font-extrabold text-destructive transition-all hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Edit Name Modal */}
      <AnimatePresence>
        {editModal === "name" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-md rounded-3xl border-2 border-border bg-card p-6 shadow-[var(--shadow-float)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-extrabold text-foreground">Edit Name</h3>
                <button onClick={closeEdit} className="rounded-full p-1 hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-extrabold text-muted-foreground mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="w-full h-11 rounded-xl border-2 border-border bg-background px-4 text-sm font-extrabold text-foreground outline-none transition-all focus:border-crimson"
                    placeholder="Enter your full name"
                  />
                </div>
                <button
                  onClick={handleSaveName}
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-gradient-to-r from-crimson to-ember text-sm font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Email Modal */}
      <AnimatePresence>
        {editModal === "email" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-md rounded-3xl border-2 border-border bg-card p-6 shadow-[var(--shadow-float)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-extrabold text-foreground">Update Email</h3>
                <button onClick={closeEdit} className="rounded-full p-1 hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-extrabold text-muted-foreground mb-1.5 block">New Email Address</label>
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    className="w-full h-11 rounded-xl border-2 border-border bg-background px-4 text-sm font-extrabold text-foreground outline-none transition-all focus:border-crimson"
                    placeholder="Enter new email address"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-muted-foreground mb-1.5 block">Current Password (for verification)</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-11 rounded-xl border-2 border-border bg-background px-4 text-sm font-extrabold text-foreground outline-none transition-all focus:border-crimson"
                    placeholder="Enter your current password"
                  />
                </div>
                <button
                  onClick={handleSendEmailOTP}
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-gradient-to-r from-crimson to-ember text-sm font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Update Email"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Phone Modal */}
      <AnimatePresence>
        {editModal === "phone" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-md rounded-3xl border-2 border-border bg-card p-6 shadow-[var(--shadow-float)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-extrabold text-foreground">Update Phone Number</h3>
                <button onClick={closeEdit} className="rounded-full p-1 hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <div>
                      <label className="text-xs font-extrabold text-muted-foreground mb-1.5 block">New Phone Number</label>
                      <input
                        type="tel"
                        value={phoneValue}
                        onChange={(e) => setPhoneValue(e.target.value)}
                        className="w-full h-11 rounded-xl border-2 border-border bg-background px-4 text-sm font-extrabold text-foreground outline-none transition-all focus:border-crimson"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <button
                      onClick={handleSendPhoneOTP}
                      disabled={loading}
                      className="w-full h-11 rounded-full bg-gradient-to-r from-crimson to-ember text-sm font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:shadow-lg disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter the 6-digit OTP sent to {phoneValue}
                      </p>
                      <OtpInput
                        length={6}
                        onComplete={(otp) => setOtpValue(otp)}
                        loading={loading}
                      />
                    </div>
                    <button
                      onClick={handleVerifyPhoneOTP}
                      disabled={loading || otpValue.length !== 6}
                      className="w-full h-11 rounded-full bg-gradient-to-r from-crimson to-ember text-sm font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:shadow-lg disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify & Update"}
                    </button>
                    <button
                      onClick={handleSendPhoneOTP}
                      disabled={loading}
                      className="w-full text-xs font-extrabold text-crimson hover:text-crimson/80 disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
