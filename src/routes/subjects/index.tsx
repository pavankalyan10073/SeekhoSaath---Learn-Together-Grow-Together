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
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

function SubjectsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden pb-14 pt-28 sm:pb-20 sm:pt-36 md:pb-24 md:pt-40">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute -top-28 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl sm:-top-36 sm:h-[500px] sm:w-[500px] sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border-2 border-border bg-card px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
              Subjects
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Explore all <span className="text-gradient">subjects</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
              From primary school to professional courses — find expert tutors for every subject.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-px mx-auto max-w-7xl pb-16 sm:pb-20 md:pb-28">
        {subjectCategories.map((category, catIdx) => (
          <motion.section
            key={category.id}
            {...fadeUp}
            transition={{ duration: 0.6, delay: catIdx * 0.1, ease: easeOutExpo }}
            className="mb-14 sm:mb-20 md:mb-28"
          >
            <div className="mb-8 sm:mb-10">
              <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
                {category.name}
              </h2>
              <p className="mt-2 text-base text-muted-foreground sm:mt-3 sm:text-lg">
                {category.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {category.subjects.map((subject, subIdx) => (
                <motion.div
                  key={subject.id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: subIdx * 0.04, ease: easeOutExpo }}
                >
                  <Link
                    to="/subjects/$subjectId"
                    params={{ subjectId: subject.id }}
                    className="group block rounded-2xl border-2 border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-premium)] sm:rounded-3xl sm:p-7"
                  >
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{subject.emoji}</div>
                    <h3 className="font-display text-base font-bold sm:text-lg">{subject.name}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                      {subject.tutorCount} tutors
                    </p>
                    <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground/80 sm:text-sm">
                      {subject.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 sm:text-sm">
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
