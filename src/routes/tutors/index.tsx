"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { tutors as staticTutors } from "@/data/tutors";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { useState, useEffect } from "react";
import { getApprovedTutors, type Tutor } from "@/lib/supabase-data";

export const Route = createFileRoute("/tutors/")({
  head: () => ({
    meta: [
      { title: "All Tutors — SeekhoSaath" },
      {
        name: "description",
        content: "Browse all verified expert tutors. Find the perfect tutor for any subject.",
      },
    ],
  }),
  component: TutorsPage,
});

const ALL_SUBJECTS = [...new Set(staticTutors.map((t) => t.subj.split("•")[0].trim()))];

function TutorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [sortBy, setSortBy] = useState<"rating" | "sessions" | "price">("rating");
  const [dbTutors, setDbTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTutors = async () => {
      try {
        const approved = await getApprovedTutors();
        setDbTutors(approved);
      } catch (error) {
        console.error("Failed to load tutors from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTutors();
  }, []);

  const tutors = dbTutors.length > 0 ? dbTutors : staticTutors;

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
    <main className="min-h-screen bg-background text-foreground pb-safe pt-16 sm:pt-20">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute -top-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-crimson/25 blur-3xl sm:-top-28 sm:h-[400px] sm:w-[400px] sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border-2 border-crimson/30 bg-crimson/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-crimson sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
              Our Tutors
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl">
              Meet our <span className="text-gradient">expert tutors</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              20+ verified tutors ready to help you excel. Filter by subject, sort by rating or
              price.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container-px mx-auto max-w-7xl pb-4 sm:pb-6">
        <div
          className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3"
        >
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5 sm:left-4"
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
              className="w-full rounded-xl border-2 border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-crimson transition-colors sm:rounded-full sm:py-3 sm:pl-11 sm:text-base"
            />
          </div>
          <div className="flex gap-2 sm:gap-2.5">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="flex-1 rounded-xl border-2 border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-crimson transition-colors sm:rounded-full sm:px-4 sm:py-3 sm:text-base"
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
              className="flex-1 rounded-xl border-2 border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-crimson transition-colors sm:rounded-full sm:px-4 sm:py-3 sm:text-base"
            >
              <option value="rating">Top Rated</option>
              <option value="sessions">Most Sessions</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </div>
        <p className="mt-2.5 text-xs text-muted-foreground sm:mt-3 sm:text-sm">
          {loading ? "Loading tutors..." : <>Showing <span className="font-extrabold text-foreground">{filtered.length}</span> of{" "}<span className="font-extrabold text-foreground">{tutors.length}</span> tutors</>}
        </p>
      </section>

      {/* Tutor Grid */}
      <section className="container-px mx-auto max-w-7xl py-6 sm:py-8 md:py-12">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t, i) => (
              <div
                key={t.id}
                className=""
              >
                <Link
                  to="/tutors/$tutorId"
                  params={{ tutorId: t.id }}
                  className="group block overflow-hidden rounded-2xl border-2 border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-crimson/30 hover:shadow-[var(--shadow-premium)] sm:rounded-3xl"
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
                    <div className="absolute left-2.5 top-2.5 rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-bold backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs shadow-lg">
                      ★ {t.rating}
                    </div>
                    <div
                      className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-crimson to-ember text-sm text-white shadow-lg sm:right-3 sm:top-3 sm:h-9 sm:w-9 sm:text-base"
                      title="Verified"
                    >
                      ✓
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
                      <span className="inline-flex w-full items-center justify-center rounded-full bg-white/95 px-4 py-2.5 text-sm font-bold text-foreground backdrop-blur transition-all hover:bg-white sm:text-base">
                        View profile →
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 sm:p-4">
                    <h3 className="font-display text-base font-bold sm:text-lg">{t.name}</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm">{t.subj}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs">
                      <span>📍 {t.location}</span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5 sm:mt-3 sm:pt-3">
                      <div>
                        <div className="font-display text-base font-bold sm:text-lg">
                          {t.price}
                          <span className="text-xs font-normal text-muted-foreground sm:text-sm">
                            /Session
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground sm:text-xs">
                          {t.sessions}+ sessions
                        </div>
                      </div>
                      <span className="rounded-full bg-navy px-3 py-2 text-[11px] font-bold text-white transition-all hover:bg-crimson hover:shadow-lg sm:px-4 sm:py-2.5 sm:text-xs">
                        Book
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-border bg-card p-8 text-center sm:p-12">
            <div className="text-3xl sm:text-4xl">🔍</div>
            <h3 className="mt-3 font-display text-base font-bold sm:text-lg">No tutors found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("all");
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson to-ember px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-base"
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
