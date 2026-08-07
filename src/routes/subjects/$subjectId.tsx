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

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: easeOutExpo },
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
          subject.name.toLowerCase().includes(s.toLowerCase().split(" ")[0]),
      ),
  );

  const otherSubjects = category.subjects.filter((s) => s.id !== subject.id);

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
          <motion.div {...fadeUp}>
            <Link
              to="/subjects"
              className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors sm:text-lg"
            >
              ← All subjects
            </Link>
            <div className="mt-5 flex items-center gap-4 sm:mt-6 sm:gap-5">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary-soft text-4xl sm:h-20 sm:w-20 sm:rounded-[2rem] sm:text-5xl shadow-[var(--shadow-soft)]">
                {subject.emoji}
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-primary sm:text-base">
                  {category.name}
                </p>
                <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  {subject.name}
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
              {subject.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
              <div className="rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold sm:px-5 sm:py-2.5 sm:text-base">
                {subject.tutorCount} expert tutors
              </div>
              <div className="rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold sm:px-5 sm:py-2.5 sm:text-base">
                {category.name} category
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topics */}
      {subject.topics && subject.topics.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-8 sm:py-12 md:py-16">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
              Topics Covered
            </h2>
            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
              {subject.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-semibold transition-all hover:border-primary sm:px-5 sm:py-2.5 sm:text-base"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Tutors for this subject */}
      <section className="container-px mx-auto max-w-7xl py-8 sm:py-12 md:py-16">
        <motion.div {...fadeUp}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">
              Top Tutors for {subject.name}
            </h2>
            <Link
              to="/tutors"
              className="shrink-0 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold hover:border-primary transition-colors sm:px-5 sm:py-2.5 sm:text-base"
            >
              View all →
            </Link>
          </div>
        </motion.div>

        {relatedTutors.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {relatedTutors.slice(0, 6).map((t, i) => (
              <motion.div
                key={t.id}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06, ease: easeOutExpo }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
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
          <div className="mt-8 rounded-3xl border-2 border-border bg-card p-10 text-center sm:mt-10 sm:p-16">
            <div className="text-4xl sm:text-5xl">🔍</div>
            <h3 className="mt-4 font-display text-lg font-bold sm:text-xl">
              No tutors found for this subject yet
            </h3>
            <p className="mt-2 text-base text-muted-foreground">
              Browse all tutors to find the perfect match for your learning needs.
            </p>
            <Link
              to="/tutors"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-base font-bold text-primary-foreground sm:px-6 sm:py-3 sm:text-lg"
            >
              Browse all tutors →
            </Link>
          </div>
        )}
      </section>

      {/* Other subjects in same category */}
      {otherSubjects.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-8 sm:py-12 md:py-16">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">
              Other subjects in {category.name}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {otherSubjects.map((s) => (
                <Link
                  key={s.id}
                  to="/subjects/$subjectId"
                  params={{ subjectId: s.id }}
                  className="group flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-soft)] sm:rounded-3xl sm:p-5"
                >
                  <span className="text-2xl sm:text-3xl">{s.emoji}</span>
                  <div>
                    <div className="font-display text-sm font-bold sm:text-base">{s.name}</div>
                    <div className="text-xs text-muted-foreground sm:text-sm">
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
