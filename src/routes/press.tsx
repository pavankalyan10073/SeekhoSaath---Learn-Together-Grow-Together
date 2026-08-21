import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press — SeekhoSaath" },
      {
        name: "description",
        content: "Latest news, press releases, and media resources from SeekhoSaath.",
      },
    ],
  }),
  component: PressPage,
});

function PressPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-16 sm:pt-20">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Press</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          News, updates, and media resources from SeekhoSaath.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Latest News</h2>
            <p className="mt-3">
              SeekhoSaath raises $10M to expand tutoring access across India. Read the full announcement to learn how we're scaling our platform and reaching more students.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Media Kit</h2>
            <p className="mt-3">
              Download logos, product screenshots, and brand guidelines from our media kit. For press inquiries, contact press@seekhosaath.com.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
