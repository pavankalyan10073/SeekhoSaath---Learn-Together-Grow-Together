import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { subjectCategories } from "@/data/subjects";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/subjects/")({
  head: () => ({
    meta: [
      { title: "All Subjects — SeekhoSaath" },
      {
        name: "description",
        content:
          "Browse all subjects by category. Find expert tutors for classes 1-12, programming languages, and BTech courses.",
      },
    ],
  }),
  component: SubjectsPage,
});

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

function SubjectsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-14">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute -top-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-crimson/25 blur-3xl sm:-top-28 sm:h-[400px] sm:w-[400px] sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border-2 border-crimson/30 bg-crimson/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-crimson sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
              Subjects
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl">
              Explore all <span className="text-gradient">subjects</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              From primary school to professional courses — find expert tutors for every subject.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-px mx-auto max-w-7xl pb-12 sm:pb-16 md:pb-20">
        {subjectCategories.map((category, catIdx) => (
          <motion.section
            key={category.id}
            {...fadeUp}
            transition={{ duration: 0.6, delay: catIdx * 0.1, ease: easeOutExpo }}
            className="mb-10 sm:mb-14 md:mb-16"
          >
            <div className="mb-5 sm:mb-6">
              <h2 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
                {category.name}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2 sm:text-base">
                {category.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
              {category.subjects.map((subject, subIdx) => (
                <motion.div
                  key={subject.id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: subIdx * 0.04, ease: easeOutExpo }}
                >
                  <Link
                    to="/subjects/$subjectId"
                    params={{ subjectId: subject.id }}
                    className="group block rounded-xl border-2 border-border bg-card p-4 transition-all duration-500 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-[var(--shadow-premium)] sm:rounded-2xl sm:p-5"
                  >
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{subject.emoji}</div>
                    <h3 className="font-display text-sm font-bold sm:text-base">{subject.name}</h3>
                    <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                      {subject.tutorCount} tutors
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground/80 sm:text-xs">
                      {subject.description}
                    </p>
                    <span className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-crimson opacity-0 transition-all duration-300 group-hover:opacity-100 sm:text-xs">
                      View details →
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <Footer />
    </main>
  );
}
