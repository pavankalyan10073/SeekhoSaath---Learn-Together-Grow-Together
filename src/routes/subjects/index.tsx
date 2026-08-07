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
      { name: "description", content: "Browse all subjects by category. Find expert tutors for classes 1-12, programming languages, and BTech courses." },
    ],
  }),
  component: SubjectsPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4 },
};

function SubjectsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden pb-12 pt-24 sm:pb-16 sm:pt-28 md:pb-20 md:pt-32">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-2xl sm:-top-32 sm:h-[400px] sm:w-[400px] sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:px-3 sm:py-1 sm:text-xs sm:tracking-[0.18em]">
              Subjects
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:mt-4 sm:text-4xl md:text-5xl">
              Explore all <span className="text-gradient">subjects</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              From primary school to professional courses — find expert tutors for every subject.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-px mx-auto max-w-7xl pb-16 sm:pb-20 md:pb-24">
        {subjectCategories.map((category, catIdx) => (
          <motion.section
            key={category.id}
            {...fadeUp}
            transition={{ duration: 0.4, delay: catIdx * 0.08 }}
            className="mb-12 sm:mb-16 md:mb-20"
          >
            <div className="mb-6 sm:mb-8">
              <h2 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
                {category.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
                {category.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {category.subjects.map((subject, subIdx) => (
                <motion.div
                  key={subject.id}
                  {...fadeUp}
                  transition={{ duration: 0.35, delay: subIdx * 0.04 }}
                >
                  <Link
                    to="/subjects/$subjectId"
                    params={{ subjectId: subject.id }}
                    className="group block rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-card)] sm:rounded-2xl sm:p-6"
                  >
                    <div className="text-2xl sm:text-3xl">{subject.emoji}</div>
                    <h3 className="mt-3 font-display text-sm font-bold sm:mt-4 sm:text-base">
                      {subject.name}
                    </h3>
                    <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                      {subject.tutorCount} tutors
                    </p>
                    <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/80 sm:text-xs">
                      {subject.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 transition-all group-hover:opacity-100 sm:text-xs">
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
