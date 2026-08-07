import { motion } from "motion/react";
import { useState } from "react";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";
import heroImg from "@/assets/hero-tutor.jpg";
import { SearchTutorModal } from "@/components/site/SearchTutorModal";

const SUGGESTIONS = ["Physics tutor", "IIT-JEE Math", "Spoken English", "Class 10 Science"];

export function Hero() {
  const [query, setQuery] = useState("Physics tutor");
  const [modalOpen, setModalOpen] = useState(false);

  const startSearch = () => {
    setModalOpen(true);
  };

  return (
    <section className="relative overflow-hidden pb-12 pt-24 sm:pb-16 sm:pt-28 md:pb-20 md:pt-32 lg:pb-28 lg:pt-40">
      <div className="bg-mesh absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-2xl sm:-top-32 sm:h-[400px] sm:w-[400px] sm:blur-3xl md:h-[520px] md:w-[520px]"
      />

      <div className="container-px mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* LEFT — copy + search */}
        <div className="relative order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground backdrop-blur sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            12,480 tutors live right now
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:mt-5 sm:text-5xl md:text-6xl lg:text-7xl">
            Find your perfect tutor. <span className="text-gradient">In seconds.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:mt-5 sm:text-base md:text-lg">
            SeekhoSaath instantly matches you with verified expert tutors — online or near you — for
            any subject, any class, any goal.
          </p>

          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              startSearch();
            }}
            className="mt-6 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-card)] sm:mt-8 sm:flex-row sm:items-center sm:rounded-full sm:p-1.5"
          >
            <div className="flex flex-1 items-center gap-3 px-3 py-1.5 sm:px-4 sm:py-2">
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
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:px-6 sm:py-3"
            >
              Find tutor
              <span aria-hidden>→</span>
            </button>
          </form>

          <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  startSearch();
                }}
                className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground sm:px-3 sm:py-1.5 sm:text-xs"
              >
                {s}
              </button>
            ))}
          </div>

          {/* trust row */}
          <div className="mt-6 flex items-center gap-3 sm:mt-10 sm:gap-5">
            <div className="flex -space-x-2">
              {[tutor1, tutor2, tutor3, tutor4].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  width={32}
                  height={32}
                  loading="lazy"
                  className="h-8 w-8 rounded-full border-2 border-background object-cover sm:h-9 sm:w-9"
                />
              ))}
            </div>
            <div className="text-xs sm:text-sm">
              <div className="flex items-center gap-1 font-semibold">
                <span className="text-primary">★★★★★</span>
                <span className="ml-1 text-foreground">4.9/5</span>
              </div>
              <div className="text-muted-foreground">from 38,000+ students</div>
            </div>
          </div>
        </div>

        {/* RIGHT — visual canvas */}
        <div className="relative order-2 mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="relative aspect-[4/3] w-full sm:aspect-square">
            <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-soft via-card to-card shadow-[var(--shadow-soft)] sm:rounded-[2rem]">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-border sm:rounded-[2rem]" />

              {/* Map grid */}
              <svg
                className="absolute inset-0 h-full w-full opacity-30"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path
                      d="M10 0H0V10"
                      stroke="currentColor"
                      strokeWidth="0.15"
                      className="text-primary/40"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#g)" />
              </svg>

              {/* Center student avatar */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-primary/40" />
                  <span
                    className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-primary/30"
                    style={{ animationDelay: "0.8s" }}
                  />
                  <div className="relative h-16 w-16 overflow-hidden rounded-full ring-3 ring-background shadow-[var(--shadow-glow)] sm:h-20 sm:w-20 md:h-24 md:w-24">
                    <img
                      src={heroImg}
                      alt="You"
                      loading="lazy"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-background sm:px-2.5 sm:py-1 sm:text-[10px]">
                    You
                  </div>
                </div>
              </div>

              {/* Floating tutor pills */}
              {[
                { name: "Aanya R.", subject: "Physics", img: tutor1, x: "12%", y: "22%" },
                { name: "Rahul M.", subject: "Math", img: tutor2, x: "78%", y: "16%" },
                { name: "Sara K.", subject: "Chemistry", img: tutor3, x: "8%", y: "70%" },
                { name: "Dev P.", subject: "English", img: tutor4, x: "82%", y: "66%" },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, type: "spring", damping: 18 }}
                  className="absolute animate-float"
                  style={{ left: t.x, top: t.y, animationDelay: `${i * 0.7}s` }}
                >
                  <div className="flex items-center gap-1.5 rounded-full bg-card p-1 pr-2 shadow-[var(--shadow-card)] ring-1 ring-border sm:gap-2 sm:pr-3">
                    <img
                      src={t.img}
                      alt={t.name}
                      loading="lazy"
                      width={32}
                      height={32}
                      className="h-7 w-7 rounded-full object-cover sm:h-9 sm:w-9"
                    />
                    <div className="leading-tight">
                      <div className="text-[10px] font-semibold sm:text-xs">{t.name}</div>
                      <div className="text-[9px] text-muted-foreground sm:text-[10px]">{t.subject}</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Status badge */}
              <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 sm:top-6">
                <div className="glass flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-foreground shadow-[var(--shadow-card)] sm:px-4 sm:py-2 sm:text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Ready to match
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Tutor Modal */}
      <SearchTutorModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
