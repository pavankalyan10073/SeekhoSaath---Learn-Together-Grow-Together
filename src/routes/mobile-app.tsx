import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/mobile-app")({
  head: () => ({
    meta: [
      { title: "Mobile App — SeekhoSaath" },
      {
        name: "description",
        content: "Download the SeekhoSaath mobile app for seamless learning on the go.",
      },
    ],
  }),
  component: MobileAppPage,
});

function MobileAppPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-14 sm:pt-16">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Mobile App</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Learn on the go with the SeekhoSaath mobile app. Available on iOS and Android.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-8">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Features</h2>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Book and manage sessions from anywhere</li>
              <li>Receive reminders and notifications</li>
              <li>Access learning materials offline</li>
              <li>Chat with tutors in real-time</li>
              <li>Track progress and goals</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Coming Soon</h2>
            <p className="mt-3">
              The SeekhoSaath mobile app is currently in development. Join our waitlist to be the first to know when it launches.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
