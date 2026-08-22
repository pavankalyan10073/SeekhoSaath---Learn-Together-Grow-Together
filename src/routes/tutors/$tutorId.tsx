"use client";

import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { tutors as staticTutors } from "@/data/tutors";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { useState, useEffect } from "react";
import { getTutorById } from "@/lib/supabase-data";

function ClientOnlyDialogs({ tutor, bookOpen, setBookOpen, meetingOpen, setMeetingOpen }: { tutor: { id: string; name: string; subj: string }; bookOpen: boolean; setBookOpen: (open: boolean) => void; meetingOpen: boolean; setMeetingOpen: (open: boolean) => void }) {
  const [ready, setReady] = useState(false);
  const [Dialogs, setDialogs] = useState<{ BookSessionDialog: React.ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void; tutor: { id: string; name: string; subj: string } }>; MeetingDialog: React.ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void; tutor: { id: string; name: string; subj: string } }> } | null>(null);

  useEffect(() => {
    import("@/components/site/BookingDialogs")
      .then((mod) => {
        setDialogs({ BookSessionDialog: mod.BookSessionDialog, MeetingDialog: mod.MeetingDialog });
        setReady(true);
      })
      .catch((error) => {
        console.error("Failed to load booking dialogs:", error);
      });
  }, []);

  if (!ready || !Dialogs) return null;

  return (
    <>
      <Dialogs.BookSessionDialog open={bookOpen} onOpenChange={setBookOpen} tutor={tutor} />
      <Dialogs.MeetingDialog open={meetingOpen} onOpenChange={setMeetingOpen} tutor={tutor} />
    </>
  );
}

export const Route = createFileRoute("/tutors/$tutorId")({
  head: () => ({
    meta: [
      { title: "Tutor Profile — SeekhoSaath" },
      { name: "description", content: "View tutor profile, specializations, and book a session." },
    ],
  }),
  loader: async ({ params }) => {
    const tutor = await getTutorById(params.tutorId);
    if (!tutor) {
      const fallback = staticTutors.find((t) => t.id === params.tutorId);
      if (!fallback) throw notFound();
      return fallback;
    }
    return tutor;
  },
  component: TutorDetailPage,
});

function TutorDetailPage() {
  const tutor = Route.useLoaderData<typeof staticTutors[number]>();
  const [bookOpen, setBookOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);

  console.log("TutorDetailPage loaded tutor:", tutor?.id, tutor?.name);

  return (
    <main className="min-h-screen bg-background text-foreground pb-safe pt-14 sm:pt-16">
      <Navbar />

      <section className="relative overflow-hidden pt-2 pb-6 sm:pt-3 sm:pb-8 md:pt-4 md:pb-10">
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
                      <span className="text-xs font-normal text-muted-foreground sm:text-sm">/Session</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs mt-0.5">Per session</div>
                  </div>
                  <div className="rounded-xl border-2 border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">{tutor.sessions}+</div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs mt-0.5">Sessions done</div>
                  </div>
                  <div className="rounded-xl border-2 border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">{tutor.experience}</div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs mt-0.5">Experience</div>
                  </div>
                  <div className="rounded-xl border-2 border-border bg-card px-3 py-2 text-center sm:px-4 sm:py-3">
                    <div className="font-display text-lg font-bold sm:text-xl">{tutor.responseTime}</div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs mt-0.5">Response time</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                  <button
                    onClick={() => setBookOpen(true)}
                    className="rounded-full bg-gradient-to-r from-crimson to-ember px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-base"
                  >
                    Book a session →
                  </button>
                  <button
                    onClick={() => setMeetingOpen(true)}
                    className="rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-bold transition-all hover:border-crimson hover:text-crimson sm:px-6 sm:py-3 sm:text-base"
                  >
                    Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-8 sm:py-10 md:py-14">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border-2 border-border bg-card p-5 sm:rounded-3xl sm:p-6 col-span-2 md:col-span-2 lg:col-span-1">
            <h2 className="font-display text-base font-bold sm:text-lg">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">{tutor.bio}</p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-5 sm:rounded-3xl sm:p-6">
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm">Languages</h3>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                {tutor.languages.map((l) => (
                  <span key={l} className="rounded-full border-2 border-border bg-background px-2.5 py-1 text-xs font-semibold sm:px-3 sm:py-1.5">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-5 sm:rounded-3xl sm:p-6">
            <h2 className="font-display text-base font-bold sm:text-lg">Specializations</h2>
            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
              {tutor.specializations.map((s) => (
                <span key={s} className="rounded-full bg-gradient-to-r from-crimson/10 to-ember/10 px-3 py-1.5 text-xs font-bold text-crimson sm:px-3.5 sm:py-2 sm:text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ClientOnlyDialogs tutor={{ id: tutor.id, name: tutor.name, subj: tutor.subj }} bookOpen={bookOpen} setBookOpen={setBookOpen} meetingOpen={meetingOpen} setMeetingOpen={setMeetingOpen} />
      <Footer />
    </main>
  );
}
