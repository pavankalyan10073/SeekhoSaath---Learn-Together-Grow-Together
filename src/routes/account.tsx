import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
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
  ExternalLink,
  ArrowUpRight,
  Activity,
  BarChart3,
  MessageSquare,
  FileText,
  HelpCircle,
  Moon,
  Globe2,
  BellRing,
  CheckCheck,
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
    tutorsEngaged: 0,
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
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
      case "pending":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
      case "cancelled":
      case "failed":
        return "bg-red-500/15 text-red-700 dark:text-red-400";
      case "completed":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtext, color, gradient }: {
    icon: any;
    label: string;
    value: string | number;
    subtext?: string;
    color: string;
    gradient: string;
  }) => (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl transition-all duration-500 group-hover:opacity-20`} />
      <div className="relative">
        <div className={`inline-flex rounded-xl bg-gradient-to-br ${gradient} p-2.5 text-white shadow-md`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {value}
          </div>
          <div className="mt-0.5 text-xs font-semibold text-muted-foreground sm:text-sm">
            {label}
          </div>
          {subtext && (
            <div className="mt-1 text-[10px] font-medium text-muted-foreground/80 sm:text-xs">
              {subtext}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ icon: Icon, title, description, action, actionLabel }: {
    icon: any;
    title: string;
    description: string;
    action?: () => void;
    actionLabel?: string;
  }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-crimson/10 to-ember/10 flex items-center justify-center">
          <Icon className="h-8 w-8 text-crimson/60" />
        </div>
        <div className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-mint/20 flex items-center justify-center">
          <Activity className="h-3 w-3 text-mint" />
        </div>
      </div>
      <h3 className="mt-4 font-display text-base font-extrabold text-foreground sm:text-lg">
        {title}
      </h3>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground sm:text-sm">
        {description}
      </p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson to-ember px-5 py-2.5 text-xs font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:shadow-lg hover:-translate-y-0.5 sm:text-sm"
        >
          {actionLabel}
          <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      )}
    </div>
  );

  const SessionCard = ({ booking }: { booking: Booking }) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-crimson to-ember flex items-center justify-center text-white font-extrabold text-sm shadow-md sm:h-12 sm:w-12">
              {booking.tutorName.charAt(0)}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${getStatusColor(booking.status)}`} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-foreground truncate sm:text-base">
              {isTutor ? booking.studentName : booking.tutorName}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{booking.tutorSubject}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground sm:text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2 py-0.5 font-semibold">
                <Video className="h-3 w-3" />
                {booking.mode}
              </span>
              {booking.date && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(booking.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                  {booking.time && (
                    <span className="font-medium">• {booking.time}</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold sm:px-3 sm:py-1.5 sm:text-xs ${getStatusColor(booking.status)}`}>
            {booking.status}
          </div>
          <div className="mt-1.5 text-sm font-extrabold text-foreground sm:text-base">
            {formatCurrency(booking.amount)}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const NotificationCard = ({ notification }: { notification: typeof notifications[0] }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 sm:p-5 ${
        notification.read
          ? "border-border/80 bg-gradient-to-br from-card to-muted/10"
          : "border-crimson/30 bg-gradient-to-br from-crimson/5 to-ember/5 shadow-sm"
      }`}
    >
      {!notification.read && (
        <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-crimson shadow-[var(--shadow-glow)]" />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${notification.read ? "bg-muted-foreground/30" : "bg-crimson"}`} />
            <div className="text-sm font-extrabold text-foreground truncate sm:text-base">
              {notification.title}
            </div>
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground leading-relaxed sm:text-sm">
            {notification.message}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/70 sm:text-xs">
            <Clock className="h-3 w-3" />
            {new Date(notification.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div
            aria-hidden
            className="absolute -top-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-crimson/15 blur-3xl sm:-top-28 sm:h-80 sm:w-80"
          />
          <div
            aria-hidden
            className="absolute top-1/2 right-0 -z-10 h-48 w-48 translate-x-1/4 rounded-full bg-ember/10 blur-3xl sm:h-64 sm:w-64"
          />
        </div>

        <div className="container-px mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-card/80 shadow-[var(--shadow-card)] backdrop-blur-sm">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-br from-navy via-navy to-crimson/95 p-6 sm:p-8 md:p-10">
              <div className="absolute inset-0 bg-[url('/hero-tutor-rounded.jpg')] opacity-10 mix-blend-overlay" />
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-crimson/20 blur-3xl" />

              <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-crimson to-ember p-[3px] shadow-[var(--shadow-glow)] sm:h-24 sm:w-24">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-background text-2xl font-extrabold text-white sm:text-3xl">
                      {initial}
                    </div>
                  </div>
                  {isTutor && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-mint p-1.5 shadow-lg ring-4 ring-navy">
                      <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl md:text-4xl">
                    {displayName}
                  </h1>
                  <p className="mt-1 flex items-center justify-center gap-2 text-xs text-white/80 sm:text-sm">
                    <Mail className="h-3 w-3" />
                    {user?.email}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold backdrop-blur-sm ${
                      isTutor
                        ? "bg-mint/20 text-mint border border-mint/30"
                        : isAdmin
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
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
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-extrabold text-white border border-white/20 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
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
            <div className="border-b border-border/60 bg-muted/20">
              <div className="flex gap-0.5 px-3 pt-2 sm:px-6 sm:pt-3 overflow-x-auto">
                {([
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  { id: "sessions", label: "Sessions", icon: Calendar },
                  { id: "notifications", label: "Notifications", icon: BellRing, showBadge: true },
                  { id: "settings", label: "Settings", icon: Settings },
                ] as const).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const showBadge = tab.showBadge && ((tab.id === "sessions" && isTutor && bookings.filter((b) => b.status === "pending").length > 0) || (tab.id === "notifications" && unreadCount > 0));
                  const badgeCount = tab.id === "sessions" ? bookings.filter((b) => b.status === "pending").length : unreadCount;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`relative flex items-center gap-2 rounded-t-xl px-4 py-3 text-sm font-extrabold whitespace-nowrap transition-all sm:px-5 ${
                        isActive
                          ? "text-crimson bg-gradient-to-b from-crimson/5 to-transparent"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                      {showBadge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-crimson/10 text-[10px] font-extrabold text-crimson sm:h-5.5 sm:w-5.5 sm:text-[11px]">
                          {badgeCount}
                        </span>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-crimson to-ember rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
              {loadingData ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 border-muted/30 border-t-crimson animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-crimson" />
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-semibold text-muted-foreground sm:text-sm">
                    Loading your dashboard...
                  </p>
                </div>
              ) : (
                <>
                  {activeTab === "overview" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 sm:space-y-8"
                    >
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {isTutor ? (
                          <>
                            <StatCard
                              icon={BookOpen}
                              label="Sessions"
                              value={stats.completedSessions}
                              subtext={`${stats.pendingSessions} pending`}
                              color="crimson"
                              gradient="from-crimson to-crimson/80"
                            />
                            <StatCard
                              icon={IndianRupee}
                              label="Earnings"
                              value={formatCurrency(stats.totalEarnings)}
                              subtext="Total revenue"
                              color="mint"
                              gradient="from-mint to-mint/80"
                            />
                            <StatCard
                              icon={Star}
                              label="Rating"
                              value={stats.averageRating || "New"}
                              subtext={`${stats.totalRatings} reviews`}
                              color="ember"
                              gradient="from-ember to-ember/80"
                            />
                            <StatCard
                              icon={Users}
                              label="Students"
                              value={stats.totalBookings}
                              subtext="Total bookings"
                              color="navy"
                              gradient="from-navy to-navy/80"
                            />
                          </>
                        ) : (
                          <>
                            <StatCard
                              icon={BookOpen}
                              label="Sessions"
                              value={stats.completedSessions}
                              subtext={`${stats.upcomingSessions} upcoming`}
                              color="crimson"
                              gradient="from-crimson to-crimson/80"
                            />
                            <StatCard
                              icon={Clock}
                              label="Learning"
                              value={`${stats.totalHours}h`}
                              subtext="Total hours"
                              color="blue"
                              gradient="from-blue-500 to-blue-600"
                            />
                            <StatCard
                              icon={IndianRupee}
                              label="Spent"
                              value={formatCurrency(stats.totalSpent)}
                              subtext="Total investment"
                              color="amber"
                              gradient="from-amber-500 to-amber-600"
                            />
                            <StatCard
                              icon={Users}
                              label="Tutors"
                              value={stats.tutorsEngaged}
                              subtext="Unique tutors"
                              color="mint"
                              gradient="from-mint to-mint/80"
                            />
                          </>
                        )}
                      </div>

                      {/* Recent Activity */}
                      <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/10 p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2 sm:text-xl">
                            <div className="rounded-xl bg-crimson/10 p-2">
                              <TrendingUp className="h-4 w-4 text-crimson sm:h-5 sm:w-5" />
                            </div>
                            Recent {isTutor ? "Bookings" : "Sessions"}
                          </h3>
                          {bookings.length > 0 && (
                            <button
                              onClick={() => setActiveTab("sessions")}
                              className="text-xs font-extrabold text-crimson hover:text-crimson/80 transition-colors"
                            >
                              View all →
                            </button>
                          )}
                        </div>
                        {bookings.length === 0 ? (
                          <EmptyState
                            icon={Calendar}
                            title={`No ${isTutor ? "bookings" : "sessions"} yet`}
                            description={isTutor ? "When students book sessions with you, they will appear here." : "Start your learning journey by booking a session with an expert tutor."}
                            action={() => navigate({ to: "/tutors" })}
                            actionLabel={isTutor ? undefined : "Explore Tutors"}
                          />
                        ) : (
                          <div className="space-y-3">
                            {bookings.slice(0, 5).map((booking) => (
                              <SessionCard key={booking.id} booking={booking} />
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
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2 sm:text-xl">
                          <div className="rounded-xl bg-crimson/10 p-2">
                            <Calendar className="h-4 w-4 text-crimson sm:h-5 sm:w-5" />
                          </div>
                          {isTutor ? "Your Schedule" : "Your Sessions"}
                        </h3>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {bookings.length} total
                        </span>
                      </div>
                      {bookings.length === 0 ? (
                        <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/10">
                          <EmptyState
                            icon={Calendar}
                            title="No sessions scheduled"
                            description="Your upcoming and past sessions will appear here."
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {bookings.map((booking) => (
                            <SessionCard key={booking.id} booking={booking} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "notifications" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2 sm:text-xl">
                          <div className="rounded-xl bg-crimson/10 p-2">
                            <Bell className="h-4 w-4 text-crimson sm:h-5 sm:w-5" />
                          </div>
                          Notifications
                          {unreadCount > 0 && (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-crimson/10 text-[10px] font-extrabold text-crimson sm:h-5.5 sm:w-5.5 sm:text-[11px]">
                              {unreadCount}
                            </span>
                          )}
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 px-3 py-1.5 text-xs font-extrabold text-crimson transition-all hover:bg-crimson/20 hover:scale-105"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/10">
                          <EmptyState
                            icon={Bell}
                            title="No notifications yet"
                            description="You'll receive notifications for bookings, payments, and updates here."
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {notifications.map((notif) => (
                            <NotificationCard key={notif.id} notification={notif} />
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
                      <div className="grid gap-3 sm:gap-4">
                        <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/10 overflow-hidden divide-y divide-border/60">
                          <button
                            onClick={() => openEdit("name")}
                            className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/30 sm:p-5"
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="rounded-xl bg-gradient-to-br from-crimson/10 to-ember/10 p-2.5">
                                <User className="h-4 w-4 text-crimson sm:h-5 sm:w-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-extrabold text-foreground sm:text-base">Full Name</div>
                                <div className="text-xs text-muted-foreground sm:text-sm">{displayName}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                          </button>
                          <button
                            onClick={() => openEdit("email")}
                            className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/30 sm:p-5"
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="rounded-xl bg-gradient-to-br from-mint/10 to-mint/20 p-2.5">
                                <Mail className="h-4 w-4 text-mint sm:h-5 sm:w-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-extrabold text-foreground sm:text-base">Email Address</div>
                                <div className="text-xs text-muted-foreground sm:text-sm">{user?.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                          </button>
                          <button
                            onClick={() => openEdit("phone")}
                            className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/30 sm:p-5"
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="rounded-xl bg-gradient-to-br from-navy/10 to-blue-500/10 p-2.5">
                                <Phone className="h-4 w-4 text-navy sm:h-5 sm:w-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-extrabold text-foreground sm:text-base">Phone Number</div>
                                <div className="text-xs text-muted-foreground sm:text-sm">{user?.phoneNumber || "+91 98765 43210"}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                          </button>
                          <button className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/30 sm:p-5">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="rounded-xl bg-gradient-to-br from-ember/10 to-amber-500/10 p-2.5">
                                <Shield className="h-4 w-4 text-ember sm:h-5 sm:w-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-extrabold text-foreground sm:text-base">Privacy & Security</div>
                                <div className="text-xs text-muted-foreground sm:text-sm">Password, 2FA, and data settings</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>

                        <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/10 overflow-hidden divide-y divide-border/60">
                          <button className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/30 sm:p-5">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-2.5">
                                <Moon className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-extrabold text-foreground sm:text-base">Appearance</div>
                                <div className="text-xs text-muted-foreground sm:text-sm">Dark mode and theme settings</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/30 sm:p-5">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-2.5">
                                <Globe2 className="h-4 w-4 text-emerald-600 sm:h-5 sm:w-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-extrabold text-foreground sm:text-base">Language</div>
                                <div className="text-xs text-muted-foreground sm:text-sm">English (India)</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/30 sm:p-5">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-2.5">
                                <HelpCircle className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-extrabold text-foreground sm:text-base">Help & Support</div>
                                <div className="text-xs text-muted-foreground sm:text-sm">Get help with your account</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-destructive/30 bg-destructive/5 px-4 py-3.5 text-sm font-extrabold text-destructive transition-all hover:bg-destructive/10 hover:border-destructive/40 sm:py-4"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
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
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-extrabold text-foreground">Edit Name</h3>
                <button onClick={closeEdit} className="rounded-full p-1 hover:bg-muted transition-colors">
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
                  className="w-full h-11 rounded-full bg-gradient-to-r from-crimson to-ember text-sm font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
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
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-extrabold text-foreground">Update Email</h3>
                <button onClick={closeEdit} className="rounded-full p-1 hover:bg-muted transition-colors">
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
                  className="w-full h-11 rounded-full bg-gradient-to-r from-crimson to-ember text-sm font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
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
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-extrabold text-foreground">Update Phone Number</h3>
                <button onClick={closeEdit} className="rounded-full p-1 hover:bg-muted transition-colors">
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
                      className="w-full h-11 rounded-full bg-gradient-to-r from-crimson to-ember text-sm font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
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
                    </div>
                    <button
                      onClick={handleVerifyPhoneOTP}
                      disabled={loading || otpValue.length !== 6}
                      className="w-full h-11 rounded-full bg-gradient-to-r from-crimson to-ember text-sm font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
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
