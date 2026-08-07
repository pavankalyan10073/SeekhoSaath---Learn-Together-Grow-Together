import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { tutors } from "@/data/tutors";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/tutors/$tutorId")({
  head: () => ({
    meta: [
      { title: "Tutor Profile — SeekhoSaath" },
      { name: "description", content: "View tutor profile, specializations, and book a session." },
    ],
  }),
  loader: ({ params }) => {
    const tutor = tutors.find((t) => t.id === params.tutorId);
    if (!tutor) throw notFound();
    return tutor;
  },
  component: TutorDetailPage,
});

function TutorDetailPage() {
  const tutor = Route.useLoaderData();

  const otherTutors = tutors.filter(
    (t) =>
      t.id !== tutor.id &&
      (t.subj === tutor.subj || t.specializations.some((s) => tutor.specializations.includes(s))),
  );

  return (
    <main className="min-h-screen bg-background text-foreground pb-safe">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-14">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute -top-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-crimson/25 blur-3xl sm:-top-28 sm:h-[400px] sm:w-[400px] sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-7xl">
          <div>
            <Link
              to="/tutors"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-crimson transition-colors sm:text-base"
            >
              ← All tutors
            </Link>
          </div>

          <div className="mt-4 sm:mt-5">
            <div className="grid gap-6 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] md:gap-8 lg:gap-10">
              {/* Image */}
              <div className="relative mx-auto w-full max-w-[280px] md:max-w-none">
                <div className="overflow-hidden rounded-2xl border-2 border-border sm:rounded-3xl shadow-[var(--shadow-float)]">
                  <img
                    src={tutor.img}
                    alt={tutor.name}
                    width={400}
                    height={500}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-crimson to-ember text-lg text-white shadow-[var(--shadow-glow)] sm:right-4 sm:top-4">
                  ✓
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-mint/15 px-2.5 py-1 text-xs font-bold text-mint sm:px-3 sm:py-1.5 sm:text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                    Verified
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-2.5 py-1 text-xs font-bold sm:px-3 sm:py-1.5 sm:text-sm">
                    ★ {tutor.rating} Rating
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-2.5 py-1 text-xs font-bold sm:px-3 sm:py-1.5 sm:text-sm">
                    📍 {tutor.location}
                  </span>
                </div>

                <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:mt-4 sm:text-3xl md:text-4xl">
                  {tutor.name}
                </h1>
                <p className="mt-1.5 text-base text-muted-foreground sm:mt-2 sm:text-lg">
                  {tutor.subj}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-2.5">
                  <div className="rounded-xl border-2 border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">
                      {tutor.price}
                      <span className="text-xs font-normal text-muted-foreground sm:text-sm">
                        /Session
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs mt-0.5">
                      Per session
                    </div>
                  </div>
                  <div className="rounded-xl border-2 border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">
                      {tutor.sessions}+
                    </div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs mt-0.5">
                      Sessions done
                    </div>
                  </div>
                  <div className="rounded-xl border-2 border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">
                      {tutor.experience}
                    </div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs mt-0.5">
                      Experience
                    </div>
                  </div>
                  <div className="rounded-xl border-2 border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">
                      {tutor.responseTime}
                    </div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs mt-0.5">
                      Response time
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                  <button className="rounded-full bg-gradient-to-r from-crimson to-ember px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-base">
                    Book a session →
                  </button>
                  <button className="rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-bold transition-all hover:border-crimson hover:text-crimson sm:px-6 sm:py-3 sm:text-base">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="container-px mx-auto max-w-7xl py-8 sm:py-10 md:py-14">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <div
            className="rounded-2xl border-2 border-border bg-card p-5 sm:rounded-3xl sm:p-6 col-span-2 md:col-span-2 lg:col-span-1"
          >
            <h2 className="font-display text-base font-bold sm:text-lg">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
              {tutor.bio}
            </p>
          </div>

          {/* Education */}
          <div
            className="rounded-2xl border-2 border-border bg-card p-5 sm:rounded-3xl sm:p-6"
          >
            <h2 className="font-display text-base font-bold sm:text-lg">Education</h2>
            <div className="mt-3 flex items-start gap-3 sm:mt-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-crimson/10 to-ember/10 text-lg sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">
                🎓
              </div>
              <div>
                <div className="text-sm font-bold sm:text-base">{tutor.education}</div>
                <div className="text-xs text-muted-foreground sm:text-sm">Degree & Institution</div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm">
                Languages
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                {tutor.languages.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border-2 border-border bg-background px-2.5 py-1 text-xs font-semibold sm:px-3 sm:py-1.5"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div
            className="rounded-2xl border-2 border-border bg-card p-5 sm:rounded-3xl sm:p-6"
          >
            <h2 className="font-display text-base font-bold sm:text-lg">Specializations</h2>
            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
              {tutor.specializations.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-gradient-to-r from-crimson/10 to-ember/10 px-3 py-1.5 text-xs font-bold text-crimson sm:px-3.5 sm:py-2 sm:text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other tutors */}
      {otherTutors.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-8 sm:py-10 md:py-14">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
                Similar Tutors
              </h2>
              <Link
                to="/tutors"
                className="shrink-0 rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-bold hover:border-crimson transition-colors sm:px-4 sm:py-2 sm:text-sm"
              >
                View all →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {otherTutors.slice(0, 3).map((t, i) => (
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
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
