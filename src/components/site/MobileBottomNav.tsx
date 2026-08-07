import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, BookOpen, User } from "lucide-react";

const items = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Search, label: "Find", to: "/tutors" },
  { icon: BookOpen, label: "Subjects", to: "/subjects" },
  { icon: User, label: "Account", to: "/login" },
];

export function MobileBottomNav() {
  const location = useLocation();

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
        </div>
      </div>
    </nav>
  );
}
