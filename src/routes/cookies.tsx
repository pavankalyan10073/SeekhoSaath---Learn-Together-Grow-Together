import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookies Policy — SeekhoSaath" },
      {
        name: "description",
        content: "Learn about how SeekhoSaath uses cookies and similar technologies.",
      },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-safe">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Cookies Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">Last updated: August 2025</p>

        <div className="mt-6 sm:mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">1. What Are Cookies</h2>
            <p className="mt-3">
              Cookies are small text files placed on your device when you visit our website. They help us provide a better experience by remembering your preferences and understanding how you use our platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">2. How We Use Cookies</h2>
            <p className="mt-3">We use cookies for:</p>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Keeping you signed in</li>
              <li>Remembering your preferences</li>
              <li>Understanding how you use our site</li>
              <li>Improving our services</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">3. Managing Cookies</h2>
            <p className="mt-3">
              You can control or disable cookies through your browser settings. However, disabling cookies may affect your experience on our platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">4. Contact Us</h2>
            <p className="mt-3">
              For questions about our use of cookies, contact us at <a href="mailto:privacy@seekhosaath.com" className="text-crimson hover:underline">privacy@seekhosaath.com</a>.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
