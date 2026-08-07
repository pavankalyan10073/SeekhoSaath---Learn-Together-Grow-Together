import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { tutors } from "@/data/tutors";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { useState } from "react";

export const Route = createFileRoute("/tutors/")({
  head: () => ({
    meta: [
      { title: "All Tutors — SeekhoSaath" },
      {
        name: "description",
        content: "Browse all 20+ verified expert tutors. Find the perfect tutor for any subject.",
      },
    ],
  }),
  component: TutorsPage,
});

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

const ALL_SUBJECTS = [...new Set(tutors.map((t) => t.subj.split("•")[0].trim()))];

function TutorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [sortBy, setSortBy] = useState<"rating" | "sessions" | "price">("rating");

  const filtered = tutors
    .filter((t) => {
      const matchesSearch =
        searchQuery === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subj.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSubject =
        selectedSubject === "all" ||
        t.subj.toLowerCase().includes(selectedSubject.toLowerCase()) ||
        t.specializations.some((s) => s.toLowerCase().includes(selectedSubject.toLowerCase()));
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "sessions") return b.sessions - a.sessions;
      return parseInt(a.price.replace("₹", "")) - parseInt(b.price.replace("₹", ""));
    });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-28 sm:pb-16 sm:pt-36 md:pb-20 md:pt-40">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute -top-28 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl sm:-top-36 sm:h-[500px] sm:w-[500px] sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border-2 border-border bg-card px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
              Our Tutors
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Meet our <span className="text-gradient">expert tutors</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
              20+ verified tutors ready to help you excel. Filter by subject, sort by rating or
              price.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="container-px mx-auto max-w-7xl pb-6 sm:pb-8">
        <motion.div
          {...fadeUp}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground sm:h-6 sm:w-6 sm:left-5"
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
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutors by name, subject, or specialization..."
              className="w-full rounded-2xl border-2 border-border bg-card py-3.5 pl-12 pr-4 text-base outline-none focus:border-primary transition-colors sm:rounded-full sm:py-4 sm:pl-14 sm:text-lg"
            />
          </div>
          <div className="flex gap-2.5 sm:gap-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="flex-1 rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-base outline-none focus:border-primary transition-colors sm:rounded-full sm:px-5 sm:py-4 sm:text-lg"
            >
              <option value="all">All Subjects</option>
              {ALL_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "rating" | "sessions" | "price")}
              className="flex-1 rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-base outline-none focus:border-primary transition-colors sm:rounded-full sm:px-5 sm:py-4 sm:text-lg"
            >
              <option value="rating">Top Rated</option>
              <option value="sessions">Most Sessions</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </motion.div>
        <motion.p {...fadeUp} className="mt-4 text-sm text-muted-foreground sm:mt-5 sm:text-base">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> of{" "}
          <span className="font-bold text-foreground">{tutors.length}</span> tutors
        </motion.p>
      </section>

      {/* Tutor Grid */}
      <section className="container-px mx-auto max-w-7xl py-8 sm:py-12 md:py-16">
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t, i) => (
              <motion.div
                key={t.id}
                {...fadeUp}
                transition={{ duration: 0.5, delay: (i % 8) * 0.05, ease: easeOutExpo }}
              >
                <Link
                  to="/tutors/$tutorId"
                  params={{ tutorId: t.id }}
                  className="group block overflow-hidden rounded-3xl border-2 border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
                    <img
                      src={t.img}
                      alt={t.name}
                      loading="lazy"
                      width={400}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1.5 text-xs font-bold backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:py-2 sm:text-sm shadow-lg">
                      ★ {t.rating}
                    </div>
                    <div
                      className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-primary text-base text-primary-foreground shadow-lg sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-lg"
                      title="Verified"
                    >
                      ✓
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-4 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                      <span className="inline-flex w-full items-center justify-center rounded-full bg-white/95 px-4 py-3 text-sm font-bold text-foreground backdrop-blur transition-all hover:bg-white sm:text-base">
                        View profile →
                      </span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-display text-lg font-bold sm:text-xl">{t.name}</h3>
                    <p className="text-sm text-muted-foreground">{t.subj}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                      <span>📍 {t.location}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4 sm:mt-5 sm:pt-5">
                      <div>
                        <div className="font-display text-lg font-bold sm:text-xl">
                          {t.price}
                          <span className="text-sm font-normal text-muted-foreground sm:text-base">
                            /Session
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground sm:text-sm">
                          {t.sessions}+ sessions
                        </div>
                      </div>
                      <span className="rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground sm:px-5 sm:py-3 sm:text-sm">
                        Book
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-border bg-card p-10 text-center sm:p-16">
            <div className="text-4xl sm:text-5xl">🔍</div>
            <h3 className="mt-4 font-display text-lg font-bold sm:text-xl">No tutors found</h3>
            <p className="mt-2 text-base text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("all");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-base font-bold text-primary-foreground sm:px-6 sm:py-3 sm:text-lg"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
