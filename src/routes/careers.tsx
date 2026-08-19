import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — SeekhoSaath" },
      {
        name: "description",
        content: "Join the SeekhoSaath team and help shape the future of education.",
      },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-safe">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Careers</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Help us redefine how the world learns. We're always looking for passionate people to join our team.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Open Positions</h2>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Senior Frontend Engineer</li>
              <li>Product Manager</li>
              <li>Content Strategist</li>
              <li>Community Manager</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Why Join Us</h2>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Work on a product that impacts millions of learners</li>
              <li>Flexible work culture with remote options</li>
              <li>Competitive compensation and benefits</li>
              <li>Grow with a fast-moving, mission-driven team</li>
            </ul>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
