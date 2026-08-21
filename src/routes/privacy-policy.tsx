import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SeekhoSaath" },
      {
        name: "description",
        content: "Learn how SeekhoSaath collects, uses, and protects your personal information.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-14 sm:pt-16">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Last updated: August 2025</p>

        <div className="mt-6 sm:mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">1. Introduction</h2>
            <p className="mt-3">
              SeekhoSaath ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">2. Information We Collect</h2>
            <p className="mt-3">We may collect the following types of information:</p>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li><strong>Personal Information:</strong> Name, email, phone number, and profile details</li>
              <li><strong>Usage Data:</strong> How you interact with our platform, including pages visited and features used</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
              <li><strong>Payment Information:</strong> Billing details when you make purchases through our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">3. How We Use Your Information</h2>
            <p className="mt-3">We use your information to:</p>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Provide and improve our tutoring services</li>
              <li>Match students with suitable tutors</li>
              <li>Process payments and send booking confirmations</li>
              <li>Send important updates about your account or bookings</li>
              <li>Improve our platform based on user feedback</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">4. Data Sharing and Disclosure</h2>
            <p className="mt-3">
              We do not sell your personal data. We may share information with trusted third-party service providers who assist us in operating our platform, such as payment processors and cloud hosting providers. All third parties are required to protect your data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">5. Data Security</h2>
            <p className="mt-3">
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">6. Cookies and Tracking</h2>
            <p className="mt-3">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">7. Your Rights</h2>
            <p className="mt-3">You have the right to:</p>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Access and update your personal information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">8. Children's Privacy</h2>
            <p className="mt-3">
              Our platform is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13 without parental consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">9. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">10. Contact Us</h2>
            <p className="mt-3">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@seekhosaath.com" className="text-crimson hover:underline">privacy@seekhosaath.com</a>.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
