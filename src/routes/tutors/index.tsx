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
      { name: "description", content: "Browse all 20+ verified expert tutors. Find the perfect tutor for any subject." },
    ],
  }),
  component: TutorsPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4 },
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
      <section className="relative overflow-hidden pb-8 pt-24 sm:pb-12 sm:pt-28 md:pb-16 md:pt-32">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-2xl sm:-top-32 sm:h-[400px] sm:w-[400px] sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:px-3 sm:py-1 sm:text-xs sm:tracking-[0.18em]">
              Our Tutors
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:mt-4 sm:text-4xl md:text-5xl">
              Meet our <span className="text-gradient">expert tutors</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              20+ verified tutors ready to help you excel. Filter by subject, sort by rating or price.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="container-px mx-auto max-w-7xl pb-4 sm:pb-6">
        <motion.div {...fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5 sm:left-4"
              fill="none"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutors by name, subject, or specialization..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary sm:rounded-2xl sm:py-3 sm:pl-11 sm:text-base"
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
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
              className="flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
            >
              <option value="rating">Top Rated</option>
              <option value="sessions">Most Sessions</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </motion.div>
        <motion.p {...fadeUp} className="mt-3 text-xs text-muted-foreground sm:mt-4 sm:text-sm">
          Showing {filtered.length} of {tutors.length} tutors
        </motion.p>
      </section>

      {/* Tutor Grid */}
      <section className="container-px mx-auto max-w-7xl py-6 sm:py-8 md:py-12">
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t, i) => (
              <motion.div
                key={t.id}
                {...fadeUp}
                transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              >
                <Link
                  to="/tutors/$tutorId"
                  params={{ tutorId: t.id }}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] sm:rounded-3xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[4/5]">
                    <img
                      src={t.img}
                      alt={t.name}
                      loading="lazy"
                      width={400}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold backdrop-blur sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
                      ★ {t.rating}
                    </div>
                    <div
                      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground sm:right-3 sm:top-3 sm:h-8 sm:w-8"
                      title="Verified"
                    >
                      ✓
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-display text-base font-bold sm:text-lg">{t.name}</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm">{t.subj}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground sm:text-xs">
                      <span>📍 {t.location}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3 sm:mt-4 sm:pt-4">
                      <div>
                        <div className="font-display text-base font-bold sm:text-lg">
                          {t.price}
                          <span className="text-xs font-normal text-muted-foreground sm:text-sm">/Session</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground sm:text-xs">
                          {t.sessions}+ sessions
                        </div>
                      </div>
                      <span className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:px-4 sm:py-2 sm:text-xs">
                        Book
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
            <div className="text-3xl sm:text-4xl">🔍</div>
            <h3 className="mt-3 font-display text-base font-bold sm:text-lg">
              No tutors found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:px-5 sm:py-2.5"
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
