import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SeekhoSaath" },
      {
        name: "description",
        content: "Learn about SeekhoSaath's mission to make quality tutoring accessible to every student in India.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-14 sm:pt-16">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">About SeekhoSaath</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          We're on a mission to make personalized, expert tutoring accessible to every student, everywhere.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Our Mission</h2>
            <p className="mt-3">
              SeekhoSaath was founded with a simple belief: every student deserves access to great tutors. We connect students with verified expert tutors across every subject, making learning personalized, affordable, and effective.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Our Story</h2>
            <p className="mt-3">
              Started in India, SeekhoSaath has grown into a trusted platform serving 50,000+ students. We combine AI-powered matching with human expertise to create learning experiences that truly work.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Our Values</h2>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li><strong>Accessibility:</strong> Quality education for all</li>
              <li><strong>Trust:</strong> Verified tutors and transparent pricing</li>
              <li><strong>Innovation:</strong> Technology that enhances learning</li>
              <li><strong>Community:</strong> Learning together, growing together</li>
            </ul>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
