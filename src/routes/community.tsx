import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — SeekhoSaath" },
      {
        name: "description",
        content: "Join the SeekhoSaath community of learners, tutors, and parents.",
      },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-10 sm:pt-12">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Community</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Connect with fellow learners, tutors, and parents in the SeekhoSaath community.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Join the Conversation</h2>
            <p className="mt-3">
              Be part of a growing community passionate about learning. Share tips, ask questions, and support each other's educational journeys.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Community Guidelines</h2>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Be respectful and supportive</li>
              <li>Share knowledge and experiences</li>
              <li>Avoid spam or self-promotion</li>
              <li>Report inappropriate content</li>
            </ul>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
