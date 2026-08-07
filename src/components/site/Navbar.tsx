import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links = [
    { label: "Tutors", to: "/tutors" },
    { label: "Subjects", to: "/subjects" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
  ];

  const handleNavClick = () => setMobileOpen(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2 sm:py-3" : "py-3 sm:py-5"
      }`}
    >
      <div className="container-px mx-auto max-w-7xl">
        <nav
          className={`flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 sm:py-3 ${
            scrolled ? "glass shadow-[var(--shadow-card)]" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 pl-1 sm:gap-3 sm:pl-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground sm:h-10 sm:w-10 sm:rounded-2xl sm:shadow-[var(--shadow-glow)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-5 sm:w-5">
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
            <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
              Seekho<span className="text-primary">Saath</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.label}>
                {"to" in l && l.to ? (
                  <Link
                    to={l.to}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-primary-soft hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-primary-soft hover:text-foreground"
                  >
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <span className="hidden text-sm font-bold text-foreground sm:inline-flex max-w-[140px] truncate">
                  {user.displayName || user.email?.split("@")[0] || "User"}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-5 sm:py-2.5 sm:text-base"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-muted sm:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-6 sm:py-2.5 sm:text-base"
                >
                  Get started
                  <span aria-hidden className="hidden sm:inline text-base">
                    →
                  </span>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="grid h-10 w-10 place-items-center rounded-xl text-foreground lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 top-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-background/90 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-x-0 top-0 z-50 mx-3 mt-20 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-float)]">
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.label}>
                    {"to" in l && l.to ? (
                      <Link
                        to={l.to}
                        onClick={handleNavClick}
                        className="block rounded-2xl px-5 py-3.5 text-base font-bold text-foreground transition-all hover:bg-primary-soft"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        onClick={handleNavClick}
                        className="block rounded-2xl px-5 py-3.5 text-base font-bold text-foreground transition-all hover:bg-primary-soft"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
                {user ? (
                  <>
                    <li className="border-t border-border pt-3 mt-3">
                      <span className="block rounded-2xl px-5 py-3 text-base font-bold text-muted-foreground">
                        {user.displayName || user.email?.split("@")[0] || "User"}
                      </span>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleNavClick();
                          handleSignOut();
                        }}
                        className="block w-full text-left rounded-2xl px-5 py-3.5 text-base font-bold text-foreground transition-all hover:bg-primary-soft"
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="border-t border-border pt-3 mt-3">
                    <Link
                      to="/login"
                      onClick={handleNavClick}
                      className="block rounded-2xl px-5 py-3.5 text-base font-bold text-muted-foreground transition-all hover:bg-primary-soft hover:text-foreground"
                    >
                      Sign in
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
