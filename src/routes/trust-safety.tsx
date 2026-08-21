import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/trust-safety")({
  head: () => ({
    meta: [
      { title: "Trust & Safety — SeekhoSaath" },
      {
        name: "description",
        content: "Learn about SeekhoSaath's trust and safety measures for students and tutors.",
      },
    ],
  }),
  component: TrustSafetyPage,
});

function TrustSafetyPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-5 sm:pt-6">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Trust & Safety</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Your safety is our top priority. Learn about how we keep our platform secure and trustworthy.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Verified Tutors</h2>
            <p className="mt-3">
              Every tutor on SeekhoSaath goes through a rigorous verification process including identity checks, credential verification, and background screening.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Secure Payments</h2>
            <p className="mt-3">
              All payments are processed through secure, encrypted channels. Your financial information is protected with industry-standard security protocols.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Reporting Concerns</h2>
            <p className="mt-3">
              If you encounter any issues, please report them to <a href="mailto:safety@seekhosaath.com" className="text-crimson hover:underline">safety@seekhosaath.com</a>. We take all reports seriously and investigate promptly.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
