import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/help-center")({
  head: () => ({
    meta: [
      { title: "Help Center — SeekhoSaath" },
      {
        name: "description",
        content: "Find answers to common questions about SeekhoSaath tutoring platform.",
      },
    ],
  }),
  component: HelpCenterPage,
});

function HelpCenterPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-10 sm:pt-12">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Help Center</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Find answers to common questions and get the support you need.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Getting Started</h2>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>How do I create an account?</li>
              <li>How do I find the right tutor?</li>
              <li>How do I book a session?</li>
              <li>What payment methods are accepted?</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Sessions & Scheduling</h2>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>How do I reschedule a session?</li>
              <li>What is the cancellation policy?</li>
              <li>Can I switch tutors?</li>
              <li>How do I access session recordings?</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Technical Support</h2>
            <p className="mt-3">
              For technical issues, contact <a href="mailto:support@seekhosaath.com" className="text-crimson hover:underline">support@seekhosaath.com</a> or call +91 9391485316.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
