import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  User,
  GraduationCap,
  BookOpenCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

type Role = "student" | "tutor" | null;

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    mobile: z.string().min(10, "Enter a valid mobile number"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    agreeTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — SeekhoSaath" },
      { name: "description", content: "Create your SeekhoSaath account as a student or tutor." },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user } = useAuth();
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", mobile: "", email: "", password: "", confirmPassword: "" },
  });

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep("form");
  };

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.fullName);
      toast.success("Account created successfully!");
      navigate({ to: "/" });
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
      if (code === "auth/email-already-in-use") {
        form.setError("email", { message: "An account with this email already exists" });
      } else if (code === "auth/weak-password") {
        form.setError("password", { message: "Password is too weak. Use at least 6 characters." });
      } else {
        toast.error("Sign up failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!selectedRole) return;
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Account created with Google!");
      navigate({ to: "/" });
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
      if (code !== "auth/popup-closed-by-user") {
        toast.error("Google sign-up failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  if (user) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />

      <header className="relative z-10 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M3 7l9-4 9 4-9 4-9-4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M7 10v5c0 1 2 3 5 3s5-2 5-3v-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Seekho<span className="text-primary">Saath</span>
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {step === "role" ? (
          <Card className="w-full max-w-lg border-border shadow-[var(--shadow-card)]">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-display text-2xl font-bold tracking-tight">
                Create your account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose how you want to get started with SeekhoSaath
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <button
                type="button"
                onClick={() => handleRoleSelect("student")}
                className="w-full group relative flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-left transition-all duration-200 hover:border-primary hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5"
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg font-semibold tracking-tight">
                    Register as Student
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Find tutors, book sessions, and learn at your pace
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("tutor")}
                className="w-full group relative flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-left transition-all duration-200 hover:border-primary hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5"
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <BookOpenCheck className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg font-semibold tracking-tight">
                    Register as Tutor
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Share your expertise, teach students, and earn
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary shrink-0" />
              </button>
            </CardContent>

            <CardFooter className="justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-md border-border shadow-[var(--shadow-card)]">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                {selectedRole === "student" ? (
                  <GraduationCap className="h-6 w-6" />
                ) : (
                  <BookOpenCheck className="h-6 w-6" />
                )}
              </div>
              <CardTitle className="font-display text-2xl font-bold tracking-tight">
                {selectedRole === "student" ? "Student Registration" : "Tutor Registration"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Fill in your details to create your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your full name"
                              className="pl-10 h-11"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your mobile number"
                              className="pl-10 h-11"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10 h-11"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              className="pl-10 pr-10 h-11"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pl-10 pr-10 h-11"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-3 space-y-0 pt-1">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <Label className="text-sm font-normal text-muted-foreground cursor-pointer">
                            I agree to the{" "}
                            <span className="text-primary font-medium hover:underline">
                              Terms & Conditions
                            </span>{" "}
                            and{" "}
                            <span className="text-primary font-medium hover:underline">
                              Privacy Policy
                            </span>
                          </Label>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-semibold shadow-[var(--shadow-glow)]"
                    disabled={isLoading || googleLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign Up <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">
                    or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 gap-2 font-medium"
                onClick={handleGoogleSignUp}
                disabled={isLoading || googleLoading}
              >
                {googleLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign up with Google
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("role");
                  form.reset();
                }}
                className="w-full flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change registration type
              </button>
            </CardContent>

            <CardFooter className="justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
}
