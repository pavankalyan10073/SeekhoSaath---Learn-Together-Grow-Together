import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SeekhoSaath" },
      {
        name: "description",
        content: "Get in touch with SeekhoSaath support, sales, or partnership inquiries.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-14 sm:pt-16">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Contact Us</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          We'd love to hear from you. Reach out for support, partnerships, or general inquiries.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Support</h2>
            <p className="mt-3">
              Email: <a href="mailto:support@seekhosaath.com" className="text-crimson hover:underline">support@seekhosaath.com</a>
            </p>
            <p className="mt-2">
              Phone: <a href="tel:+919391485316" className="text-crimson hover:underline">+91 9391485316</a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Partnerships</h2>
            <p className="mt-3">
              Email: <a href="mailto:partnerships@seekhosaath.com" className="text-crimson hover:underline">partnerships@seekhosaath.com</a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">Office</h2>
            <p className="mt-3">
              SeekhoSaath Technologies Pvt. Ltd.<br />
              Hyderabad, India
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
