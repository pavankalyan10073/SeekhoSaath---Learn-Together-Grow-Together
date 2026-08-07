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
    <section className="relative overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">
      <div className="bg-mesh absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -top-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-crimson/20 blur-3xl sm:-top-28 sm:h-[500px] sm:w-[500px] sm:blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 -z-10 h-48 w-48 rounded-full bg-mint/15 blur-3xl sm:h-72 sm:w-72"
      />
      <div
        aria-hidden
        className="absolute top-20 right-0 -z-10 h-56 w-56 rounded-full bg-ember/15 blur-3xl sm:top-32 sm:h-80 sm:w-80"
      />

      <div className="container-px mx-auto max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        {/* LEFT — copy + search */}
        <div className="relative order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border-2 border-crimson/30 bg-crimson/5 px-4 py-2 text-xs font-bold text-crimson backdrop-blur-sm sm:text-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-crimson" />
            </span>
            12,480 tutors live right now
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Find your perfect tutor. <span className="text-gradient">In seconds.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-xl text-base text-muted-foreground sm:mt-5 sm:text-lg md:text-xl"
          >
            SeekhoSaath instantly matches you with verified expert tutors — online or near you — for
            any subject, any class, any goal.
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={(e) => {
              e.preventDefault();
              startSearch();
            }}
            className="mt-6 flex w-full max-w-xl flex-col gap-2.5 rounded-2xl border-2 border-border bg-card p-2 shadow-[var(--shadow-card)] backdrop-blur-sm sm:mt-8 sm:flex-row sm:items-center sm:rounded-full sm:p-1.5"
          >
            <div className="flex flex-1 items-center gap-3 px-3 py-2 sm:px-5 sm:py-3">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 text-muted-foreground sm:h-6 sm:w-6"
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
                className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-lg"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 active:translate-y-0 sm:px-8 sm:py-3.5 sm:text-lg"
            >
              Find tutor
              <span aria-hidden className="text-lg">
                →
              </span>
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-2.5"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  startSearch();
                }}
                className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground transition-all hover:border-primary hover:text-foreground hover:shadow-[var(--shadow-soft)] sm:px-4 sm:py-2 sm:text-sm"
              >
                {s}
              </button>
            ))}
          </motion.div>

          {/* trust row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex items-center gap-4 sm:mt-8 sm:gap-5"
          >
            <div className="flex -space-x-2.5">
              {[tutor1, tutor2, tutor3, tutor4].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-10 w-10 rounded-full border-[3px] border-background object-cover shadow-md sm:h-11 sm:w-11"
                />
              ))}
            </div>
            <div className="text-sm sm:text-base">
              <div className="flex items-center gap-1.5 font-extrabold">
                <span className="text-crimson text-base sm:text-lg">★★★★★</span>
                <span className="text-foreground">4.9/5</span>
              </div>
              <div className="text-muted-foreground">from 38,000+ students</div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — visual canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg"
        >
          <div className="relative aspect-[4/3] w-full sm:aspect-[3/4]">
            <div className="absolute inset-0 overflow-hidden rounded-3xl bg-gradient-to-br from-crimson/10 via-card to-ember/5 shadow-[var(--shadow-float)] sm:rounded-[2.5rem] ring-1 ring-border">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-soft/30 via-transparent to-mint/10 opacity-60" />

              {/* Map grid */}
              <svg
                className="absolute inset-0 h-full w-full opacity-25"
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
                      className="text-crimson/50"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#g)" />
              </svg>

              {/* Center student avatar */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-crimson/40" />
                  <span
                    className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-crimson/30"
                    style={{ animationDelay: "0.8s" }}
                  />
                  <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-background shadow-[var(--shadow-glow)] sm:h-24 sm:w-24 md:h-28 md:w-28">
                    <img
                      src={heroImg}
                      alt="You"
                      loading="lazy"
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white sm:px-3.5 sm:py-1.5 sm:text-xs">
                    You
                  </div>
                </div>
              </div>

              {/* Floating tutor pills */}
              {[
                { name: "Aanya R.", subject: "Physics", img: tutor1, x: "8%", y: "16%" },
                { name: "Rahul M.", subject: "Math", img: tutor2, x: "72%", y: "12%" },
                { name: "Sara K.", subject: "Chemistry", img: tutor3, x: "5%", y: "65%" },
                { name: "Dev P.", subject: "English", img: tutor4, x: "76%", y: "62%" },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.12, type: "spring", damping: 16 }}
                  className="absolute animate-float"
                  style={{ left: t.x, top: t.y, animationDelay: `${i * 0.8}s` }}
                >
                  <div className="flex items-center gap-2 rounded-full bg-card p-1 pr-3 shadow-[var(--shadow-card)] ring-1 ring-border backdrop-blur-sm sm:gap-2.5 sm:pr-4">
                    <img
                      src={t.img}
                      alt={t.name}
                      loading="lazy"
                      width={40}
                      height={40}
                      className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                    />
                    <div className="leading-tight">
                      <div className="text-xs font-bold sm:text-sm">{t.name}</div>
                      <div className="text-[10px] text-muted-foreground sm:text-xs">
                        {t.subject}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 top-5 z-10 -translate-x-1/2 sm:top-6"
              >
                <div className="glass flex items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-foreground shadow-[var(--shadow-card)] sm:px-5 sm:py-2.5 sm:text-base">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
                  </span>
                  Ready to match
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Tutor Modal */}
      <SearchTutorModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
