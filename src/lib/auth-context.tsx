import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updatePhoneNumber,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { getUserRole } from "@/lib/supabase-data";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  updateProfileEmail: (currentPassword: string, newEmail: string) => Promise<void>;
  sendPhoneOTP: (phoneNumber: string) => Promise<{ confirmationResult: any; verificationId: string }>;
  verifyPhoneOTP: (verificationId: string, otp: string) => Promise<any>;
  userRole: string | null;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const refreshUserRole = async (uid: string) => {
    try {
      const role = await getUserRole(uid);
      setUserRole(role);
    } catch {
      setUserRole(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await refreshUserRole(firebaseUser.uid);
        try {
          await fetch("/api/profiles/upsert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: firebaseUser.uid,
              email: firebaseUser.email || "",
              fullName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "",
              role: (await getUserRole(firebaseUser.uid)) || "student",
            }),
          });
        } catch {
          // profile sync failed, continue
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    return credential.user;
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileName = async (name: string) => {
    if (!user) throw new Error("No user logged in");
    await updateProfile(user, { displayName: name });
  };

  const updateProfileEmail = async (currentPassword: string, newEmail: string) => {
    if (!user || !user.email) throw new Error("No user logged in");
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updateProfile(user, { email: newEmail });
  };

  const sendPhoneOTP = async (phoneNumber: string) => {
    if (!recaptchaContainerRef.current) {
      throw new Error("Recaptcha container not found");
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
      size: "invisible",
      callback: () => {},
    });

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return {
      confirmationResult,
      verificationId: (confirmationResult as any).verificationId,
    };
  };

  const verifyPhoneOTP = async (verificationId: string, otp: string) => {
    if (!user) throw new Error("No user logged in");
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    await updatePhoneNumber(user, credential);
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
      <div ref={recaptchaContainerRef} className="hidden" />
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
