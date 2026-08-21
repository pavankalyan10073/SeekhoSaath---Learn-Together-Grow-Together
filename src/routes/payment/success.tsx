import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/payment/success")({
  head: () => ({
    meta: [
      { title: "Payment Successful — SeekhoSaath" },
      { name: "description", content: "Your payment was successful. Your subscription/booking is now active." },
    ],
  }),
  component: PaymentSuccess,
});

function PaymentSuccess() {
  const [status, setStatus] = useState<"success" | "failed" | "loading">("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    if (orderId) {
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground pb-safe pt-5 sm:pt-6">
      <Navbar />
      <section className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-crimson border-t-transparent" />
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Verifying your payment...</h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">Please wait while we confirm your transaction.</p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint/15 text-3xl sm:h-20 sm:w-20 sm:text-4xl">
                ✓
              </div>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Payment Successful!</h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Your payment has been processed successfully. You will receive a confirmation email shortly.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/tutors" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-crimson to-ember px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-base">
                  Browse Tutors
                </Link>
                <Link to="/" className="inline-flex items-center justify-center rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-bold transition-all hover:border-crimson hover:text-crimson sm:px-6 sm:py-3 sm:text-base">
                  Go Home
                </Link>
              </div>
            </>
          )}
          {status === "failed" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-crimson/15 text-3xl sm:h-20 sm:w-20 sm:text-4xl">
                !
              </div>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Payment Failed</h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                We couldn't verify your payment. Please try again or contact support if the amount was deducted.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/tutors" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-crimson to-ember px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-base">
                  Browse Tutors
                </Link>
                <Link to="/" className="inline-flex items-center justify-center rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-bold transition-all hover:border-crimson hover:text-crimson sm:px-6 sm:py-3 sm:text-base">
                  Go Home
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
