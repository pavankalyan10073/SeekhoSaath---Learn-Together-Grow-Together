"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";

interface AdminUser {
  email: string;
  role: "admin";
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const ADMIN_EMAIL = "seekhosaath@gmail.com";
const ADMIN_PASSWORD = "123456";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email === ADMIN_EMAIL) {
          setAdmin({ email: ADMIN_EMAIL, role: "admin" });
        }
      }
    } catch {
      localStorage.removeItem("admin_auth");
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email: ADMIN_EMAIL, role: "admin" as const };
      setAdmin(adminUser);
      try {
        localStorage.setItem("admin_auth", JSON.stringify(adminUser));
      } catch {
        // storage may be unavailable
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    try {
      localStorage.removeItem("admin_auth");
    } catch {
      // ignore
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
