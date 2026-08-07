import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { getSubjectById, subjectCategories } from "@/data/subjects";
import { tutors } from "@/data/tutors";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/subjects/$subjectId")({
  head: () => ({
    meta: [
      { title: "Subject Details — SeekhoSaath" },
      { name: "description", content: "Find expert tutors for this subject." },
    ],
  }),
  loader: ({ params }) => {
    const result = getSubjectById(params.subjectId);
    if (!result) throw notFound();
    return result;
  },
  component: SubjectDetailPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4 },
};

function SubjectDetailPage() {
  const { subject, category } = Route.useLoaderData();

  const relatedTutors = tutors.filter(
    (t) =>
      t.subj.toLowerCase().includes(subject.name.toLowerCase().split(" ")[0]) ||
      subject.name.toLowerCase().includes(t.subj.toLowerCase().split(" ")[0]) ||
      t.specializations.some(
        (s) =>
          s.toLowerCase().includes(subject.name.toLowerCase().split(" ")[0]) ||
          subject.name.toLowerCase().includes(s.toLowerCase().split(" ")[0])
      )
  );

  const otherSubjects = category.subjects.filter((s) => s.id !== subject.id);

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
          <motion.div {...fadeUp}>
            <Link
              to="/subjects"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              ← All subjects
            </Link>
            <div className="mt-4 flex items-center gap-3 sm:mt-6 sm:gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-3xl sm:h-16 sm:w-16 sm:rounded-3xl sm:text-4xl">
                {subject.emoji}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
                  {category.name}
                </p>
                <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
                  {subject.name}
                </h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              {subject.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
              <div className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm">
                {subject.tutorCount} expert tutors
              </div>
              <div className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm">
                {category.name} category
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topics */}
      {subject.topics && subject.topics.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-8 sm:py-12">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-lg font-bold sm:text-xl md:text-2xl">
              Topics Covered
            </h2>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              {subject.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Tutors for this subject */}
      <section className="container-px mx-auto max-w-7xl py-8 sm:py-12">
        <motion.div {...fadeUp}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold sm:text-xl md:text-2xl">
              Top Tutors for {subject.name}
            </h2>
            <Link
              to="/tutors"
              className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary sm:px-4 sm:py-2 sm:text-sm"
            >
              View all →
            </Link>
          </div>
        </motion.div>

        {relatedTutors.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {relatedTutors.slice(0, 6).map((t, i) => (
              <motion.div key={t.id} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}>
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
          <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center sm:mt-8 sm:p-12">
            <div className="text-3xl sm:text-4xl">🔍</div>
            <h3 className="mt-3 font-display text-base font-bold sm:text-lg">
              No tutors found for this subject yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse all tutors to find the perfect match for your learning needs.
            </p>
            <Link
              to="/tutors"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:px-5 sm:py-2.5"
            >
              Browse all tutors →
            </Link>
          </div>
        )}
      </section>

      {/* Other subjects in same category */}
      {otherSubjects.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-8 sm:py-12">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-lg font-bold sm:text-xl md:text-2xl">
              Other subjects in {category.name}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {otherSubjects.map((s) => (
                <Link
                  key={s.id}
                  to="/subjects/$subjectId"
                  params={{ subjectId: s.id }}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-card)] sm:rounded-2xl sm:p-4"
                >
                  <span className="text-xl sm:text-2xl">{s.emoji}</span>
                  <div>
                    <div className="font-display text-xs font-bold sm:text-sm">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs">
                      {s.tutorCount} tutors
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      <Footer />
    </main>
  );
}
