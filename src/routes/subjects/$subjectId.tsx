import { createFileRoute, notFound, Link } from "@tanstack/react-router";
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
    <main className="min-h-screen bg-background text-foreground pb-safe pt-14 sm:pt-16">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute -top-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-crimson/25 blur-3xl sm:-top-28 sm:h-[400px] sm:w-[400px] sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-7xl">
          <div>
            <Link
              to="/subjects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-crimson transition-colors sm:text-base"
            >
              ← All subjects
            </Link>
            <div className="mt-4 flex items-center gap-3 sm:mt-5 sm:gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-crimson/10 to-ember/10 text-3xl sm:h-16 sm:w-16 sm:rounded-3xl sm:text-4xl shadow-[var(--shadow-soft)]">
                {subject.emoji}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-crimson sm:text-sm">
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
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-2.5">
              <div className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-bold sm:px-4 sm:py-2 sm:text-sm">
                {subject.tutorCount} expert tutors
              </div>
              <div className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-bold sm:px-4 sm:py-2 sm:text-sm">
                {category.name} category
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      {subject.topics && subject.topics.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-6 sm:py-8 md:py-10">
          <div>
            <h2 className="font-display text-lg font-bold sm:text-xl md:text-2xl">
              Topics Covered
            </h2>
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-2.5">
              {subject.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-semibold transition-all hover:border-crimson hover:text-crimson sm:px-4 sm:py-2 sm:text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tutors for this subject */}
      <section className="container-px mx-auto max-w-7xl py-6 sm:py-8 md:py-10">
        <div>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
              Top Tutors for {subject.name}
            </h2>
            <Link
              to="/tutors"
              className="shrink-0 rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-bold hover:border-crimson transition-colors sm:px-4 sm:py-2 sm:text-sm"
            >
              View all →
            </Link>
          </div>
        </div>

        {relatedTutors.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {relatedTutors.slice(0, 6).map((t, i) => (
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
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
                      <span className="rounded-full bg-navy px-3 py-2 text-[11px] font-bold text-white transition-all hover:bg-crimson hover:text-white sm:px-4 sm:py-2.5 sm:text-xs">
                        Book
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-border bg-card p-8 text-center sm:mt-8 sm:p-12">
            <div className="text-3xl sm:text-4xl">🔍</div>
            <h3 className="mt-3 font-display text-base font-bold sm:text-lg">
              No tutors found for this subject yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse all tutors to find the perfect match for your learning needs.
            </p>
            <Link
              to="/tutors"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson to-ember px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-base"
            >
              Browse all tutors →
            </Link>
          </div>
        )}
      </section>

      {/* Other subjects in same category */}
      {otherSubjects.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-6 sm:py-8 md:py-10">
          <div>
            <h2 className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
              Other subjects in {category.name}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {otherSubjects.map((s) => (
                <Link
                  key={s.id}
                  to="/subjects/$subjectId"
                  params={{ subjectId: s.id }}
                  className="group flex items-center gap-2.5 rounded-xl border-2 border-border bg-card p-3 transition-all duration-500 hover:-translate-y-0.5 hover:border-crimson/40 hover:shadow-[var(--shadow-soft)] sm:rounded-2xl sm:p-4"
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
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
