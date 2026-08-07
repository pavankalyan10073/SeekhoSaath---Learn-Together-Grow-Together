import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePWA } from "@/lib/pwa-context";
import { toast } from "sonner";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { canInstall, triggerInstall } = usePWA();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
        scrolled ? "py-2 sm:py-2.5" : "py-2.5 sm:py-3"
      }`}
    >
      <div className="container-px mx-auto max-w-7xl">
        <nav
          className={`flex items-center justify-between rounded-full px-3.5 py-2 transition-all duration-500 sm:px-5 sm:py-2.5 ${
            scrolled
              ? "glass shadow-[var(--shadow-card)] border border-border/60"
              : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5">
            <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-crimson to-ember text-white shadow-md transition-transform duration-500 hover:scale-110 sm:h-9 sm:w-9 sm:rounded-xl sm:shadow-[var(--shadow-glow)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-5 sm:w-5">
                <path
                  d="M3 7l9-4 9 4-9 4-9-4z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 10v5c0 1 2 3 5 3s5-2 5-3v-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-display text-base font-extrabold tracking-tight sm:text-lg">
              Seekho<span className="text-gradient">Saath</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.label}>
                {"to" in l && l.to ? (
                  <Link
                    to={l.to}
                    className="rounded-full px-3 py-1.5 text-xs font-extrabold text-foreground transition-all hover:bg-primary-soft/70 hover:text-crimson sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    className="rounded-full px-3 py-1.5 text-xs font-extrabold text-foreground transition-all hover:bg-primary-soft/70 hover:text-crimson sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {l.label}
                  </a>
                )}
              </li>
            ))}
            <li>
              <Link
                to="/signup"
                className="rounded-full px-3 py-1.5 text-xs font-extrabold text-crimson transition-all hover:bg-crimson/10 sm:px-4 sm:py-2 sm:text-sm"
              >
                Become a tutor
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={triggerInstall}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-crimson to-ember px-3 py-1.5 text-[11px] font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:px-4 sm:py-2 sm:text-sm"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Get the App
            </button>
            {user ? (
              <>
                <span className="hidden text-xs font-extrabold text-foreground sm:inline-flex max-w-[120px] truncate">
                  {user.displayName || user.email?.split("@")[0] || "User"}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1.5 text-xs font-extrabold text-white transition-all hover:bg-crimson sm:px-4 sm:py-2 sm:text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-full px-3 py-1.5 text-xs font-extrabold text-foreground transition-all hover:bg-muted hover:text-crimson sm:inline-flex sm:px-4 sm:py-2 sm:text-sm"
                >
                  Sign in
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="grid h-9 w-9 place-items-center rounded-xl text-foreground transition-all hover:bg-muted lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-0 z-50 mx-3 mt-16 rounded-2xl border-2 border-border bg-card p-4 shadow-[var(--shadow-float)]"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted-foreground hover:text-background"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <ul className="space-y-0.5">
                {links.map((l) => (
                  <li key={l.label}>
                    {"to" in l && l.to ? (
                      <Link
                        to={l.to}
                        onClick={handleNavClick}
                        className="block rounded-xl px-4 py-3 text-sm font-extrabold text-foreground transition-all hover:bg-gradient-to-r hover:from-crimson/10 hover:to-ember/10 hover:text-crimson"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        onClick={handleNavClick}
                        className="block rounded-xl px-4 py-3 text-sm font-extrabold text-foreground transition-all hover:bg-gradient-to-r hover:from-crimson/10 hover:to-ember/10 hover:text-crimson"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
                <li>
                  <Link
                    to="/signup"
                    onClick={handleNavClick}
                    className="block rounded-xl px-4 py-3 text-sm font-extrabold text-crimson transition-all hover:bg-crimson/10"
                  >
                    Become a tutor
                  </Link>
                </li>
                {user ? (
                  <>
                    <li className="border-t-2 border-border pt-2 mt-2">
                      <span className="block rounded-xl px-4 py-2.5 text-sm font-extrabold text-muted-foreground">
                        {user.displayName || user.email?.split("@")[0] || "User"}
                      </span>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleNavClick();
                          handleSignOut();
                        }}
                        className="block w-full text-left rounded-xl px-4 py-3 text-sm font-extrabold text-foreground transition-all hover:bg-gradient-to-r hover:from-crimson/10 hover:to-ember/10 hover:text-crimson"
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="border-t-2 border-border pt-2 mt-2">
                      <Link
                        to="/login"
                        onClick={handleNavClick}
                        className="block rounded-xl px-4 py-3 text-sm font-extrabold text-muted-foreground transition-all hover:bg-gradient-to-r hover:from-crimson/10 hover:to-ember/10 hover:text-crimson"
                      >
                        Sign in
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signup"
                        onClick={handleNavClick}
                        className="block rounded-xl px-4 py-3 text-sm font-extrabold text-crimson transition-all hover:bg-crimson/10"
                      >
                        Get started
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
