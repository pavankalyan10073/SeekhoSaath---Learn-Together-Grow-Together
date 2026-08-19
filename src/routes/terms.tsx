import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SeekhoSaath" },
      {
        name: "description",
        content: "Read the terms and conditions for using SeekhoSaath's tutoring platform and services.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-10 sm:pt-12">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Last updated: August 2025</p>

        <div className="mt-6 sm:mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">1. Agreement to Terms</h2>
            <p className="mt-3">
              By accessing or using SeekhoSaath's platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">2. Eligibility</h2>
            <p className="mt-3">
              You must be at least 13 years old to use our platform. If you are under 18, you may only use our services with parental or guardian consent. By using our platform, you represent that you meet these eligibility requirements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">3. Account Registration</h2>
            <p className="mt-3">
              To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">4. User Conduct</h2>
            <p className="mt-3">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Use the platform for any illegal purpose</li>
              <li>Harass, abuse, or harm other users or tutors</li>
              <li>Share false or misleading information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the platform</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">5. Tutor Responsibilities</h2>
            <p className="mt-3">Tutors on our platform agree to:</p>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Provide accurate and truthful information about their qualifications</li>
              <li>Deliver sessions at the scheduled times</li>
              <li>Maintain professional conduct with students</li>
              <li>Respect student privacy and confidentiality</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">6. Payments and Subscriptions</h2>
            <p className="mt-3">
              All payments are processed securely through our payment partners. Subscription fees are billed in advance and are non-refundable except as specified in our Refund Policy. We reserve the right to change pricing with 30 days' notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">7. Cancellation</h2>
            <p className="mt-3">
              You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period. You will continue to have access to the platform until that date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">8. Intellectual Property</h2>
            <p className="mt-3">
              All content on the SeekhoSaath platform, including text, graphics, logos, and software, is the property of SeekhoSaath and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">9. Limitation of Liability</h2>
            <p className="mt-3">
              SeekhoSaath shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">10. Termination</h2>
            <p className="mt-3">
              We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">11. Governing Law</h2>
            <p className="mt-3">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of courts in Hyderabad, India.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">12. Contact Information</h2>
            <p className="mt-3">
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@seekhosaath.com" className="text-crimson hover:underline">legal@seekhosaath.com</a>.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
