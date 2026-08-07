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

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

function TutorDetailPage() {
  const tutor = Route.useLoaderData();

  const otherTutors = tutors.filter(
    (t) =>
      t.id !== tutor.id &&
      (t.subj === tutor.subj || t.specializations.some((s) => tutor.specializations.includes(s))),
  );

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
              to="/tutors"
              className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors sm:text-lg"
            >
              ← All tutors
            </Link>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mt-6 sm:mt-8">
            <div className="grid gap-8 md:grid-cols-[320px_1fr] lg:grid-cols-[400px_1fr] md:gap-12 lg:gap-16">
              {/* Image */}
              <div className="relative mx-auto w-full max-w-[320px] md:max-w-none">
                <div className="overflow-hidden rounded-3xl border-2 border-border sm:rounded-[2rem] shadow-[var(--shadow-float)]">
                  <img
                    src={tutor.img}
                    alt={tutor.name}
                    width={500}
                    height={625}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-primary text-xl text-primary-foreground shadow-[var(--shadow-glow)] sm:right-5 sm:top-5 sm:h-14 sm:w-14 sm:text-2xl">
                  ✓
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3.5 py-1.5 text-sm font-bold text-success sm:px-4 sm:py-2 sm:text-base">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Verified
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-3.5 py-1.5 text-sm font-bold sm:px-4 sm:py-2 sm:text-base">
                    ★ {tutor.rating} Rating
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-3.5 py-1.5 text-sm font-bold sm:px-4 sm:py-2 sm:text-base">
                    📍 {tutor.location}
                  </span>
                </div>

                <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
                  {tutor.name}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground sm:mt-3 sm:text-xl md:text-2xl">
                  {tutor.subj}
                </p>

                <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                  <div className="rounded-2xl border-2 border-border bg-card px-4 py-3 text-center sm:px-5 sm:py-4 sm:rounded-3xl">
                    <div className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
                      {tutor.price}
                      <span className="text-sm font-normal text-muted-foreground sm:text-base">
                        /Session
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground sm:text-sm mt-1">Per session</div>
                  </div>
                  <div className="rounded-2xl border-2 border-border bg-card px-4 py-3 text-center sm:px-5 sm:py-4 sm:rounded-3xl">
                    <div className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
                      {tutor.sessions}+
                    </div>
                    <div className="text-xs text-muted-foreground sm:text-sm mt-1">
                      Sessions done
                    </div>
                  </div>
                  <div className="rounded-2xl border-2 border-border bg-card px-4 py-3 text-center sm:px-5 sm:py-4 sm:rounded-3xl">
                    <div className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
                      {tutor.experience}
                    </div>
                    <div className="text-xs text-muted-foreground sm:text-sm mt-1">Experience</div>
                  </div>
                  <div className="rounded-2xl border-2 border-border bg-card px-4 py-3 text-center sm:px-5 sm:py-4 sm:rounded-3xl">
                    <div className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
                      {tutor.responseTime}
                    </div>
                    <div className="text-xs text-muted-foreground sm:text-sm mt-1">
                      Response time
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                  <button className="rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-8 sm:py-4 sm:text-lg">
                    Book a session →
                  </button>
                  <button className="rounded-full border-2 border-border bg-card px-6 py-3 text-base font-bold transition-all hover:border-primary sm:px-8 sm:py-4 sm:text-lg">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <motion.div
            {...fadeUp}
            className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8 md:col-span-2 lg:col-span-1"
          >
            <h2 className="font-display text-lg font-bold sm:text-xl">About</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
              {tutor.bio}
            </p>
          </motion.div>

          {/* Education */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8"
          >
            <h2 className="font-display text-lg font-bold sm:text-xl">Education</h2>
            <div className="mt-4 flex items-start gap-4 sm:mt-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-lg sm:h-12 sm:w-12 sm:rounded-3xl sm:text-xl">
                🎓
              </div>
              <div>
                <div className="text-base font-bold sm:text-lg">{tutor.education}</div>
                <div className="text-sm text-muted-foreground">Degree & Institution</div>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground sm:text-base">
                Languages
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tutor.languages.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border-2 border-border bg-background px-3 py-1.5 text-sm font-semibold sm:px-4 sm:py-2"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Specializations */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8"
          >
            <h2 className="font-display text-lg font-bold sm:text-xl">Specializations</h2>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
              {tutor.specializations.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary-soft px-3.5 py-2 text-sm font-semibold text-primary sm:px-4 sm:py-2.5 sm:text-base"
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
        <section className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
          <motion.div {...fadeUp}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">
                Similar Tutors
              </h2>
              <Link
                to="/tutors"
                className="shrink-0 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold hover:border-primary transition-colors sm:px-5 sm:py-2.5 sm:text-base"
              >
                View all →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {otherTutors.slice(0, 3).map((t, i) => (
                <motion.div
                  key={t.id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: easeOutExpo }}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1.5 text-xs font-bold backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:py-2 sm:text-sm shadow-lg">
                        ★ {t.rating}
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
                        <div className="font-display text-lg font-bold sm:text-xl">
                          {t.price}
                          <span className="text-sm font-normal text-muted-foreground sm:text-base">
                            /Session
                          </span>
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
          </motion.div>
        </section>
      )}

      <Footer />
    </main>
  );
}
