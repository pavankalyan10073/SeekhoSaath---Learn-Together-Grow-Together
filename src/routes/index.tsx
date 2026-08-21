import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import {
  LogoMarquee,
  Stats,
  Features,
  Subjects,
  Tutors,
  HowItWorks,
  Testimonials,
  Pricing,
  FAQ,
  CTA,
  Footer,
} from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SeekhoSaath — Learn Together, Grow Together" },
      {
        name: "description",
        content:
          "Find the perfect tutor in seconds. Verified expert tutors for every subject, online and nearby. 50,000+ students trust SeekhoSaath.",
      },
      { property: "og:title", content: "SeekhoSaath — Learn Together, Grow Together" },
      { property: "og:description", content: "Match with verified expert tutors in seconds." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SeekhoSaath",
          slogan: "Learn Together, Grow Together",
          description:
            "AI-powered tutoring platform connecting students with verified expert tutors.",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-16 sm:pt-20">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <Stats />
      <Features />
      <Subjects />
      <Tutors />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
