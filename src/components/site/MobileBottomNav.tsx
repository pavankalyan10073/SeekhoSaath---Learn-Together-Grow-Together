import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, BookOpen, GraduationCap, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const items = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Search, label: "Find", to: "/tutors" },
  { icon: BookOpen, label: "Subjects", to: "/subjects" },
  { icon: GraduationCap, label: "Teach", to: "/signup" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-2 mb-2 overflow-hidden rounded-2xl border border-border bg-card/95 shadow-[var(--shadow-float)] backdrop-blur-xl">
        <div className="flex items-center justify-between px-2 py-1.5">
          {items.map((item) => {
            const isActive =
              item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all duration-200"
              >
                <item.icon
                  className={`h-5 w-5 transition-colors duration-200 ${isActive ? "text-crimson" : "text-muted-foreground"}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-extrabold transition-colors duration-200 ${isActive ? "text-crimson" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="h-0.5 w-4 rounded-full bg-gradient-to-r from-crimson to-ember" />
                )}
              </Link>
            );
          })}
          <Link
            to={user ? "/account" : "/login"}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all duration-200 ${
              location.pathname === "/account" || location.pathname === "/login"
                ? "text-crimson"
                : "text-muted-foreground"
            }`}
          >
            <div className="relative">
              <User
                className={`h-5 w-5 transition-colors duration-200 ${
                  location.pathname === "/account" || location.pathname === "/login" ? "text-crimson" : "text-muted-foreground"
                }`}
                strokeWidth={location.pathname === "/account" || location.pathname === "/login" ? 2.5 : 2}
              />
              {user && (
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-mint" />
              )}
            </div>
            <span
              className={`text-[10px] font-extrabold transition-colors duration-200 ${
                location.pathname === "/account" || location.pathname === "/login" ? "text-crimson" : "text-muted-foreground"
              }`}
            >
              Account
            </span>
            {(location.pathname === "/account" || location.pathname === "/login") && (
              <span className="h-0.5 w-4 rounded-full bg-gradient-to-r from-crimson to-ember" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
