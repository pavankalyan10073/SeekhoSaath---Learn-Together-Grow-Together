import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — SeekhoSaath" },
      {
        name: "description",
        content: "Understand SeekhoSaath's refund policy for tutoring sessions and subscriptions.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-10 sm:pt-12">
      <Navbar />

      <section className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">Refund Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Last updated: August 2025</p>

        <div className="mt-6 sm:mt-8 space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base sm:space-y-10">
          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">1. Our Commitment</h2>
            <p className="mt-3">
              At SeekhoSaath, we strive to ensure your satisfaction with every learning experience. This Refund Policy outlines the terms and conditions for refunds on our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">2. First Session Guarantee</h2>
            <p className="mt-3">
              We offer a <strong>100% money-back guarantee</strong> on your first paid session if it doesn't meet your expectations. If you're not satisfied with your first session, contact us within 24 hours for a full refund.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">3. Subscription Refunds</h2>
            <p className="mt-3">For monthly subscriptions (Learner and Mastery plans):</p>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li><strong>Cancellation:</strong> You may cancel your subscription at any time from your account settings.</li>
              <li><strong>Refund Eligibility:</strong> If you cancel within 7 days of your first payment, you're eligible for a full refund of that payment.</li>
              <li><strong>Partial Months:</strong> No refunds for partial months after the 7-day period. Your access continues until the end of your billing period.</li>
              <li><strong>No-Show Policy:</strong> Sessions missed without 24-hour notice are non-refundable.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">4. Pay-Per-Session Refunds</h2>
            <p className="mt-3">For individual session bookings:</p>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Cancellations made 24+ hours before the session: Full refund</li>
              <li>Cancellations made 2-24 hours before the session: 50% refund</li>
              <li>Cancellations made less than 2 hours before: No refund</li>
              <li>If a tutor cancels: Full refund or reschedule at your preference</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">5. Exceptional Circumstances</h2>
            <p className="mt-3">
              We understand that emergencies happen. In cases of medical emergencies, technical issues on our platform, or other exceptional circumstances, please contact our support team. We evaluate each case individually and aim to find a fair resolution.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">6. Refund Process</h2>
            <p className="mt-3">To request a refund:</p>
            <ol className="mt-3 list-decimal space-y-2 ml-4 sm:ml-5">
              <li>Contact our support team at <a href="mailto:support@seekhosaath.com" className="text-crimson hover:underline">support@seekhosaath.com</a></li>
              <li>Provide your booking reference or transaction ID</li>
              <li>Explain the reason for your refund request</li>
              <li>Our team will review and respond within 3-5 business days</li>
            </ol>
            <p className="mt-3">
              Approved refunds are processed within 7-10 business days to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">7. Non-Refundable Items</h2>
            <p className="mt-3">The following are not eligible for refunds:</p>
            <ul className="mt-3 list-disc space-y-2 ml-4 sm:ml-5">
              <li>Services already rendered (completed sessions)</li>
              <li>Digital content downloaded or accessed</li>
              <li>Subscription fees after the 7-day cancellation period</li>
              <li>Sessions cancelled with less than 2 hours notice</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">8. Changes to This Policy</h2>
            <p className="mt-3">
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold sm:text-xl">9. Contact Us</h2>
            <p className="mt-3">
              For refund requests or questions about this policy, please reach out to:
            </p>
            <p className="mt-3">
              <strong>Email:</strong> <a href="mailto:support@seekhosaath.com" className="text-crimson hover:underline">support@seekhosaath.com</a>
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
