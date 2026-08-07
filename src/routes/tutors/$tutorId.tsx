import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
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

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4 },
};

function TutorDetailPage() {
  const tutor = Route.useLoaderData();

  const otherTutors = tutors.filter(
    (t) => t.id !== tutor.id && (t.subj === tutor.subj || t.specializations.some((s) => tutor.specializations.includes(s)))
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pb-8 pt-24 sm:pb-12 sm:pt-28 md:pb-16 md:pt-32">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div className="container-px mx-auto max-w-7xl">
          <motion.div {...fadeUp}>
            <Link
              to="/tutors"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              ← All tutors
            </Link>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mt-4 sm:mt-6">
            <div className="grid gap-6 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] md:gap-8 lg:gap-10">
              {/* Image */}
              <div className="relative mx-auto w-full max-w-[280px] md:max-w-none">
                <div className="overflow-hidden rounded-2xl border border-border sm:rounded-3xl">
                  <img
                    src={tutor.img}
                    alt={tutor.name}
                    width={400}
                    height={500}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-primary text-lg text-primary-foreground shadow-[var(--shadow-glow)] sm:right-4 sm:top-4">
                  ✓
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success sm:px-3 sm:py-1.5 sm:text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Verified
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold sm:px-3 sm:py-1.5 sm:text-sm">
                    ★ {tutor.rating} Rating
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold sm:px-3 sm:py-1.5 sm:text-sm">
                    📍 {tutor.location}
                  </span>
                </div>

                <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:mt-4 sm:text-3xl md:text-4xl">
                  {tutor.name}
                </h1>
                <p className="mt-1 text-base text-muted-foreground sm:mt-2 sm:text-lg">
                  {tutor.subj}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 sm:mt-6 sm:gap-4">
                  <div className="rounded-xl border border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">
                      {tutor.price}
                      <span className="text-xs font-normal text-muted-foreground sm:text-sm">/Session</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs">Per session</div>
                  </div>
                  <div className="rounded-xl border border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">{tutor.sessions}+</div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs">Sessions done</div>
                  </div>
                  <div className="rounded-xl border border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">{tutor.experience}</div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs">Experience</div>
                  </div>
                  <div className="rounded-xl border border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-sm font-bold sm:text-base">{tutor.responseTime}</div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs">Response time</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
                  <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-base">
                    Book a session →
                  </button>
                  <button className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary sm:px-6 sm:py-3 sm:text-base">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="container-px mx-auto max-w-7xl py-8 sm:py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card p-5 sm:rounded-3xl sm:p-7 md:col-span-2 lg:col-span-1">
            <h2 className="font-display text-base font-bold sm:text-lg">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3">
              {tutor.bio}
            </p>
          </motion.div>

          {/* Education */}
          <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="rounded-2xl border border-border bg-card p-5 sm:rounded-3xl sm:p-7">
            <h2 className="font-display text-base font-bold sm:text-lg">Education</h2>
            <div className="mt-2 flex items-start gap-3 sm:mt-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-sm sm:h-10 sm:w-10 sm:rounded-2xl sm:text-base">
                🎓
              </div>
              <div>
                <div className="text-sm font-semibold sm:text-base">{tutor.education}</div>
                <div className="text-xs text-muted-foreground sm:text-sm">Degree & Institution</div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                Languages
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {tutor.languages.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium sm:px-3 sm:py-1.5 sm:text-sm"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Specializations */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-5 sm:rounded-3xl sm:p-7">
            <h2 className="font-display text-base font-bold sm:text-lg">Specializations</h2>
            <div className="mt-2 flex flex-wrap gap-2 sm:mt-3">
              {tutor.specializations.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary sm:px-3 sm:py-1.5 sm:text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other tutors */}
      {otherTutors.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-8 sm:py-12">
          <motion.div {...fadeUp}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-lg font-bold sm:text-xl md:text-2xl">
                Similar Tutors
              </h2>
              <Link
                to="/tutors"
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary sm:px-4 sm:py-2 sm:text-sm"
              >
                View all →
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {otherTutors.slice(0, 3).map((t, i) => (
                <motion.div key={t.id} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}>
                  <Link
                    to="/tutors/$tutorId"
                    params={{ tutorId: t.id }}
                    className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] sm:rounded-3xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={t.img}
                        alt={t.name}
                        loading="lazy"
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold backdrop-blur sm:left-3 sm:top-3">
                        ★ {t.rating}
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="font-display text-base font-bold sm:text-lg">{t.name}</h3>
                      <p className="text-xs text-muted-foreground sm:text-sm">{t.subj}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                        <div className="font-display text-base font-bold sm:text-lg">
                          {t.price}
                          <span className="text-xs font-normal text-muted-foreground sm:text-sm">/Session</span>
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
          </motion.div>
        </section>
      )}

      <Footer />
    </main>
  );
}
