import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { getUserRole, updateUserRole, saveUserProfile } from "@/lib/supabase-data";
import { toast } from "sonner";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  updateProfileEmail: (currentPassword: string, newEmail: string) => Promise<void>;
  sendPhoneOTP: (phoneNumber: string) => Promise<{ verificationId: string }>;
  verifyPhoneOTP: (verificationId: string, otp: string) => Promise<any>;
  userRole: string | null;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const refreshUserRole = async (uid: string) => {
    try {
      const role = await getUserRole(uid);
      setUserRole(role);
    } catch {
      setUserRole(null);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        refreshUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw error;
    return data.user;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  };

  const updateProfileName = async (name: string) => {
    if (!user) throw new Error("No user logged in");
    const { error } = await supabase.auth.updateUser({ data: { display_name: name } });
    if (error) throw error;
    await saveUserProfile(user.id, { full_name: name });
  };

  const updateProfileEmail = async (_currentPassword: string, newEmail: string) => {
    if (!user) throw new Error("No user logged in");
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw error;
    await saveUserProfile(user.id, { email: newEmail });
  };

  const sendPhoneOTP = async (phoneNumber: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    if (error) throw error;
    return { verificationId: phoneNumber };
  };

  const verifyPhoneOTP = async (_verificationId: string, otp: string) => {
    if (!user) throw new Error("No user logged in");
    const { error } = await supabase.auth.verifyOtp({
      phone: user.phone || "",
      token: otp,
      type: "sms",
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfileName,
        updateProfileEmail,
        sendPhoneOTP,
        verifyPhoneOTP,
        userRole,
        refreshUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
