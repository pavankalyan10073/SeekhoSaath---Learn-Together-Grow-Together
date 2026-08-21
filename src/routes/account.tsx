import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
  getStudentBookings,
  getTutorBookings,
  getStudentStats,
  getTutorStats,
  getNotifications,
  markAllNotificationsRead,
  subscribeToBookings,
  subscribeToTutorBookings,
  subscribeToNotifications,
  subscribeToSessions,
  type Booking,
} from "@/lib/supabase-data";
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
  Bell,
  TrendingUp,
  DollarSign,
  Users,
  Video,
  Award as Trophy,
  Target,
  Zap,
  RefreshCw,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — SeekhoSaath" },
      { name: "description", content: "Manage your SeekhoSaath account and track your learning journey." },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

type Tab = "overview" | "sessions" | "notifications" | "settings";

function AccountPage() {
  const { user, signOut, updateProfileName, updateProfileEmail, sendPhoneOTP, verifyPhoneOTP, userRole, refreshUserRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editModal, setEditModal] = useState<"name" | "email" | "phone" | null>(null);

  const [nameValue, setNameValue] = useState(user?.displayName || user?.email?.split("@")[0] || "");
  const [emailValue, setEmailValue] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [phoneValue, setPhoneValue] = useState("+91 ");
  const [otpValue, setOtpValue] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [role, setRole] = useState<string>(userRole || "student");
  const [tutorId, setTutorId] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalSpent: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalHours: 0,
  });
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }>>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  const isTutor = role === "tutor";
  const isAdmin = role === "admin";

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (userRole) setRole(userRole);
  }, [userRole]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user?.id) return;
      setLoadingData(true);
      try {
        if (isTutor) {
          const { data: tutorRow } = await supabase
            .from("tutors")
            .select("id")
            .eq("user_id", user.id)
            .single();
          if (tutorRow && mounted) {
            setTutorId(tutorRow.id);
            const [tutorBookings, tutorStats] = await Promise.all([
              getTutorBookings(tutorRow.id),
              getTutorStats(tutorRow.id),
            ]);
            if (mounted) {
              setBookings(tutorBookings);
              setStats((prev) => ({ ...prev, ...tutorStats, totalSpent: 0 }));
            }
          }
        } else {
          const [studentBookings, studentStats] = await Promise.all([
            getStudentBookings(user.id),
            getStudentStats(user.id),
          ]);
          if (mounted) {
            setBookings(studentBookings);
            setStats((prev) => ({ ...prev, ...studentStats, totalEarnings: 0 }));
          }
        }

        const notifs = await getNotifications(user.id);
        if (mounted) {
          setNotifications(notifs);
          setUnreadCount(notifs.filter((n) => !n.read).length);
        }
      } catch (error) {
        console.error("Failed to load account data:", error);
      } finally {
        if (mounted) setLoadingData(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user?.id, isTutor]);

  useEffect(() => {
    if (!user?.id) return;
    const unsubscribes: (() => void)[] = [];

    if (isTutor && tutorId) {
      const unsub1 = subscribeToTutorBookings(tutorId, (payload) => {
        if (payload.eventType === "INSERT") {
          toast.success("New booking received!");
        }
        getTutorBookings(tutorId).then(setBookings);
        getTutorStats(tutorId).then(setStats);
      });
      unsubscribes.push(unsub1);
    } else if (!isTutor) {
      const unsub2 = subscribeToBookings(user.id, (payload) => {
        if (payload.eventType === "INSERT") {
          toast.success("Booking confirmed!");
        }
        getStudentBookings(user.id).then(setBookings);
        getStudentStats(user.id).then(setStats);
      });
      unsubscribes.push(unsub2);
    }

    const unsub3 = subscribeToNotifications(user.id, (payload) => {
      if (payload.eventType === "INSERT") {
        setUnreadCount((c) => c + 1);
        toast.success("New notification");
      }
    });
    unsubscribes.push(unsub3);

    const unsub4 = subscribeToSessions(user.id, () => {
      if (isTutor && tutorId) {
        getTutorBookings(tutorId).then(setBookings);
        getTutorStats(tutorId).then(setStats);
      } else if (!isTutor) {
        getStudentBookings(user.id).then(setBookings);
        getStudentStats(user.id).then(setStats);
      }
    });
    unsubscribes.push(unsub4);

    return () => {
      unsubscribes.forEach((fn) => fn());
    };
  }, [user?.id, isTutor, tutorId]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const openEdit = (type: "name" | "email" | "phone") => {
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

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await markAllNotificationsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return "bg-mint/15 text-mint";
      case "pending":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
      case "cancelled":
      case "failed":
        return "bg-destructive/15 text-destructive";
      case "completed":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
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
        <div className="container-px mx-auto max-w-6xl">
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
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
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
                        : isAdmin
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-white/10 text-white border border-white/20"
                    }`}>
                      {isTutor ? (
                        <>
                          <Award className="h-3.5 w-3.5" />
                          Verified Tutor
                        </>
                      ) : isAdmin ? (
                        <>
                          <Shield className="h-3.5 w-3.5" />
                          Administrator
                        </>
                      ) : (
                        <>
                          <GraduationCap className="h-3.5 w-3.5" />
                          Student
                        </>
                      )}
                    </span>
                    {isTutor && tutorId && (
                      <Link
                        to={`/tutors/$tutorId`}
                        params={{ tutorId: tutorId }}
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold text-white border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Profile
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b-2 border-border">
              <div className="flex gap-1 px-4 sm:px-6 pt-2 overflow-x-auto">
                {(["overview", "sessions", "notifications", "settings"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-3 text-sm font-extrabold whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? "text-crimson"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "overview" && "Overview"}
                    {tab === "sessions" && (
                      <span className="flex items-center gap-1.5">
                        Sessions
                        {isTutor && bookings.filter((b) => b.status === "pending").length > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-crimson/10 text-[10px] font-extrabold text-crimson">
                            {bookings.filter((b) => b.status === "pending").length}
                          </span>
                        )}
                      </span>
                    )}
                    {tab === "notifications" && (
                      <span className="flex items-center gap-1.5">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-crimson/10 text-[10px] font-extrabold text-crimson">
                            {unreadCount}
                          </span>
                        )}
                      </span>
                    )}
                    {tab === "settings" && "Settings"}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-crimson to-ember"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
              {loadingData ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-crimson" />
                </div>
              ) : (
                <>
                  {activeTab === "overview" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {isTutor ? (
                          <>
                            <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-crimson mx-auto mb-2" />
                              <div className="text-lg sm:text-xl font-extrabold text-foreground">{stats.completedSessions}</div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Sessions</div>
                            </div>
                            <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                              <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-mint mx-auto mb-2" />
                              <div className="text-lg sm:text-xl font-extrabold text-foreground">{formatCurrency(stats.totalEarnings)}</div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Earnings</div>
                            </div>
                            <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-ember mx-auto mb-2" />
                              <div className="text-lg sm:text-xl font-extrabold text-foreground">{stats.averageRating || "New"}</div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Rating</div>
                            </div>
                            <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-navy mx-auto mb-2" />
                              <div className="text-lg sm:text-xl font-extrabold text-foreground">{stats.totalBookings}</div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Students</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-crimson mx-auto mb-2" />
                              <div className="text-lg sm:text-xl font-extrabold text-foreground">{stats.totalBookings}</div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Courses</div>
                            </div>
                            <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-navy mx-auto mb-2" />
                              <div className="text-lg sm:text-xl font-extrabold text-foreground">{stats.totalHours}h</div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Learning</div>
                            </div>
                            <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                              <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-ember mx-auto mb-2" />
                              <div className="text-lg sm:text-xl font-extrabold text-foreground">{formatCurrency(stats.totalSpent)}</div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Spent</div>
                            </div>
                            <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-mint mx-auto mb-2" />
                              <div className="text-lg sm:text-xl font-extrabold text-foreground">{stats.tutorsEngaged}</div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Tutors</div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Recent Activity */}
                      <div className="rounded-2xl border-2 border-border bg-card p-5 sm:p-6">
                        <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2 mb-4">
                          <TrendingUp className="h-5 w-5 text-crimson" />
                          Recent {isTutor ? "Bookings" : "Sessions"}
                        </h3>
                        {bookings.length === 0 ? (
                          <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No {isTutor ? "bookings" : "sessions"} yet</p>
                            {!isTutor && (
                              <Link
                                to="/tutors"
                                className="inline-flex items-center gap-2 mt-4 rounded-full bg-gradient-to-r from-crimson to-ember px-5 py-2.5 text-sm font-extrabold text-white shadow-[var(--shadow-glow)]"
                              >
                                Find Tutors
                              </Link>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {bookings.slice(0, 5).map((booking) => (
                              <div
                                key={booking.id}
                                className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-muted/20 hover:border-crimson/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-crimson to-ember flex items-center justify-center text-white font-extrabold text-sm">
                                    {booking.tutorName.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-extrabold text-foreground">
                                      {isTutor ? booking.studentName : booking.tutorName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {booking.tutorSubject} • {booking.mode}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                  </div>
                                  {booking.date && (
                                    <div className="text-[10px] text-muted-foreground mt-1">
                                      {new Date(booking.date).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "sessions" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="rounded-2xl border-2 border-border bg-card p-5 sm:p-6">
                        <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2 mb-4">
                          <Calendar className="h-5 w-5 text-crimson" />
                          {isTutor ? "Your Schedule" : "Your Sessions"}
                        </h3>
                        {bookings.length === 0 ? (
                          <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No sessions scheduled</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {bookings.map((booking) => (
                              <div
                                key={booking.id}
                                className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-muted/20"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-crimson to-ember flex items-center justify-center text-white font-extrabold">
                                    {booking.tutorName.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-extrabold text-foreground">
                                      {isTutor ? booking.studentName : booking.tutorName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {booking.tutorSubject} • {booking.mode}
                                    </div>
                                    {booking.date && (
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                  </div>
                                  <div className="text-sm font-extrabold text-foreground mt-1">
                                    {formatCurrency(booking.amount)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "notifications" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
                          <Bell className="h-5 w-5 text-crimson" />
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs font-extrabold text-crimson hover:text-crimson/80"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div className="text-center py-8">
                          <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 rounded-xl border-2 ${
                                notif.read ? "border-border bg-muted/20" : "border-crimson/30 bg-crimson/5"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="text-sm font-extrabold text-foreground">
                                    {notif.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {notif.message}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground/70 mt-2">
                                    {new Date(notif.createdAt).toLocaleString()}
                                  </div>
                                </div>
                                {!notif.read && (
                                  <div className="h-2 w-2 rounded-full bg-crimson mt-1.5 ml-2" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "settings" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
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
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
                              <div className="text-xs text-muted-foreground">{user?.phoneNumber || "+91 98765 43210"}</div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modals */}
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
