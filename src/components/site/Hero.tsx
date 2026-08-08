import { motion } from "motion/react";
import { useState } from "react";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";
import heroImg from "@/assets/hero-tutor.jpg";
import { SearchTutorModal } from "@/components/site/SearchTutorModal";
import { Link } from "@tanstack/react-router";

const SUGGESTIONS = ["Physics tutor", "IIT-JEE Math", "Spoken English", "Class 10 Science"];

export function Hero() {
  const [query, setQuery] = useState("Physics tutor");
  const [modalOpen, setModalOpen] = useState(false);

  const startSearch = () => {
    setModalOpen(true);
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-14 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20">
      <div className="bg-mesh absolute inset-0 -z-10 opacity-80" />
      <div
        aria-hidden
        className="absolute -top-16 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 rounded-full bg-crimson/20 blur-2xl sm:-top-20 sm:h-64 sm:w-64 sm:blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 -z-10 h-40 w-40 rounded-full bg-mint/15 blur-2xl sm:h-56 sm:w-56"
      />

      <div className="container-px mx-auto max-w-7xl">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
          {/* LEFT — copy + actions */}
          <div className="relative order-1 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-crimson/30 bg-crimson/5 px-3.5 py-1.5 text-[11px] font-extrabold text-crimson sm:text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
              </span>
              12,480 tutors live right now
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Learn together, <span className="text-gradient">grow together.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg"
            >
              Students match with verified tutors. Tutors match with motivated students. One
              platform, two ways to win.
            </motion.p>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3"
            >
              <button
                onClick={startSearch}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson to-ember px-5 py-2.5 text-sm font-extrabold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
              >
                Find a tutor
                <span aria-hidden className="text-base">
                  →
                </span>
              </button>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-extrabold transition-all hover:border-crimson hover:text-crimson hover:shadow-[var(--shadow-soft)] sm:px-6 sm:py-3 sm:text-base"
              >
                Teach & Earn
                <span aria-hidden className="text-base">
                  ₹
                </span>
              </Link>
            </motion.div>

            {/* Search bar */}
            <motion.form
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={(e) => {
                e.preventDefault();
                startSearch();
              }}
              className="mt-4 flex w-full max-w-lg flex-col gap-2 rounded-2xl border-2 border-border bg-card p-1.5 shadow-[var(--shadow-card)] backdrop-blur-sm sm:mt-5 sm:flex-row sm:items-center sm:rounded-full sm:p-1"
            >
              <div className="flex flex-1 items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 text-muted-foreground sm:h-5 sm:w-5"
                  fill="none"
                >
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="m20 20-3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try 'Physics tutor for Class 12'"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-extrabold text-white transition-all hover:bg-crimson sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Search
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2"
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    startSearch();
                  }}
                  className="rounded-full border-2 border-border bg-card px-2.5 py-1 text-[11px] font-extrabold text-muted-foreground transition-all hover:border-crimson hover:text-crimson hover:shadow-[var(--shadow-soft)] sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  {s}
                </button>
              ))}
            </motion.div>

            {/* trust row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 flex items-center gap-3 sm:mt-5 sm:gap-4"
            >
              <div className="flex -space-x-2">
                {[tutor1, tutor2, tutor3, tutor4].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                    className="h-8 w-8 rounded-full border-2 border-background object-cover shadow-sm"
                  />
                ))}
              </div>
              <div className="text-xs sm:text-sm">
                <div className="flex items-center gap-1 font-extrabold">
                  <span className="text-crimson text-sm sm:text-base">★★★★★</span>
                  <span className="text-foreground">4.9/5</span>
                </div>
                <div className="text-muted-foreground">from 38,000+ students</div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — matching visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 mx-auto w-full max-w-[340px] sm:max-w-sm lg:max-w-md"
          >
            <div className="relative aspect-square w-full sm:aspect-[4/3]">
              <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-crimson/10 via-card to-ember/5 shadow-[var(--shadow-float)] sm:rounded-3xl ring-1 ring-border">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-soft/30 via-transparent to-mint/10 opacity-60" />

                {/* Student side — top-left */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-3 top-3 sm:left-5 sm:top-5 right-16 sm:right-20"
                >
                  <div className="rounded-xl border border-border bg-card/95 p-2.5 shadow-lg backdrop-blur-sm sm:rounded-2xl sm:p-3">
                    <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                      <div className="h-2 w-2 rounded-full bg-mint sm:h-2.5 sm:w-2.5" />
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground sm:text-xs">
                        Students
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      {[
                        { name: "You", subject: "Physics", img: heroImg, active: true },
                        { name: "Aarav", subject: "Math", img: tutor2, active: false },
                        { name: "Priya", subject: "Chemistry", img: tutor3, active: false },
                        { name: "Rohan", subject: "English", img: tutor4, active: false },
                      ].map((p) => (
                        <div key={p.name} className="flex items-center gap-2 sm:gap-2.5">
                          <div className="relative shrink-0">
                            <img
                              src={p.img}
                              alt={p.name}
                              className="h-7 w-7 rounded-full object-cover sm:h-8 sm:w-8"
                            />
                            {p.active && (
                              <motion.span
                                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -inset-0.5 rounded-full bg-crimson/50 blur-[2px]"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-[10px] font-extrabold truncate sm:text-xs ${p.active ? "text-crimson" : "text-foreground"}`}
                            >
                              {p.name}
                            </div>
                            <div className="text-[9px] text-muted-foreground truncate sm:text-[10px]">
                              {p.subject}
                            </div>
                          </div>
                          {p.active && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-crimson sm:h-2 sm:w-2" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Tutor side — bottom-right */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute right-3 bottom-3 sm:right-5 sm:bottom-5 left-16 sm:left-20"
                >
                  <div className="rounded-xl border border-border bg-card/95 p-2.5 shadow-lg backdrop-blur-sm sm:rounded-2xl sm:p-3">
                    <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                      <div className="h-2 w-2 rounded-full bg-crimson sm:h-2.5 sm:w-2.5" />
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground sm:text-xs">
                        Tutors
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      {[
                        { name: "Aanya R.", subject: "Physics", img: tutor1 },
                        { name: "Rahul M.", subject: "Math", img: tutor2 },
                        { name: "Sara K.", subject: "Chemistry", img: tutor3 },
                        { name: "Dev P.", subject: "English", img: tutor4 },
                      ].map((p) => (
                        <motion.div
                          key={p.name}
                          whileHover={{ x: 1 }}
                          className="flex items-center gap-2 sm:gap-2.5 cursor-default"
                        >
                          <img
                            src={p.img}
                            alt={p.name}
                            className="h-7 w-7 rounded-full object-cover sm:h-8 sm:w-8"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-extrabold truncate sm:text-xs">{p.name}</div>
                            <div className="text-[9px] text-muted-foreground truncate sm:text-[10px]">
                              {p.subject}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Corner accent dots — fill all 4 corners */}
                <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-crimson/30 sm:h-2.5 sm:w-2.5 sm:top-5 sm:right-5" />
                <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-mint/30 sm:h-2.5 sm:w-2.5 sm:bottom-5 sm:left-5" />

                {/* Center match badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.button
                    onClick={startSearch}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        "0 0 20px -8px var(--shadow-glow)",
                        "0 0 32px -4px var(--shadow-glow)",
                        "0 0 20px -8px var(--shadow-glow)",
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center rounded-full bg-gradient-to-br from-crimson to-ember px-4 py-2 sm:px-5 sm:py-2.5"
                  >
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-white sm:text-sm">
                      Ready to match
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search Tutor Modal */}
      <SearchTutorModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
