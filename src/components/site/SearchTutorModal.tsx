import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";

const SEARCH_TUTORS = [
  { name: "Aanya R.", subject: "Physics", rating: 4.9, img: tutor1 },
  { name: "Rahul M.", subject: "Math", rating: 4.8, img: tutor2 },
  { name: "Sara K.", subject: "Chemistry", rating: 5.0, img: tutor3 },
  { name: "Dev P.", subject: "English", rating: 4.9, img: tutor4 },
  { name: "Priya S.", subject: "Biology", rating: 4.9, img: tutor1 },
  { name: "Arjun N.", subject: "CS", rating: 4.8, img: tutor2 },
  { name: "Meera K.", subject: "Math", rating: 5.0, img: tutor3 },
  { name: "Vikram S.", subject: "Physics", rating: 4.7, img: tutor4 },
];

type Phase = "idle" | "searching" | "found";

export function SearchTutorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [matchedTutor, setMatchedTutor] = useState(SEARCH_TUTORS[0]);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    if (!open) {
      setPhase("idle");
      setShuffling(false);
      return;
    }

    setPhase("searching");
    setShuffling(true);

    const shuffleInterval = setInterval(() => {
      setMatchedTutor(SEARCH_TUTORS[Math.floor(Math.random() * SEARCH_TUTORS.length)]);
    }, 400);

    const foundTimeout = setTimeout(() => {
      clearInterval(shuffleInterval);
      setShuffling(false);
      setMatchedTutor(SEARCH_TUTORS[Math.floor(Math.random() * SEARCH_TUTORS.length)]);
      setPhase("found");
    }, 5000);

    return () => {
      clearInterval(shuffleInterval);
      clearTimeout(foundTimeout);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] sm:rounded-3xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted-foreground hover:text-background sm:right-4 sm:top-4"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="p-5 sm:p-6">
              {/* Header */}
              <div className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft sm:h-14 sm:w-14">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-primary sm:h-7 sm:w-7"
                    fill="none"
                  >
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="m20 20-3.5-3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h2 className="mt-3 font-display text-lg font-bold sm:mt-4 sm:text-xl">
                  {phase === "searching" ? "Searching for tutors…" : "Tutor Found!"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {phase === "searching"
                    ? "Finding the best match for you…"
                    : "We found a perfect tutor for you"}
                </p>
              </div>

              {/* Searching animation */}
              {phase === "searching" && (
                <div className="mt-5 sm:mt-6">
                  {/* Shuffling tutor images */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {SEARCH_TUTORS.slice(0, 5).map((t, i) => (
                      <motion.div
                        key={t.name}
                        animate={{
                          scale: shuffling ? [1, 1.15, 1] : 1,
                          opacity: shuffling ? [0.5, 1, 0.5] : 0.5,
                        }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.08,
                          repeat: shuffling ? Infinity : 0,
                          repeatDelay: 0.2,
                        }}
                        className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-border sm:h-12 sm:w-12"
                      >
                        <img src={t.img} alt={t.name} className="h-full w-full object-cover" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted sm:mt-5 sm:h-2">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4.5, ease: "easeInOut" }}
                    />
                  </div>

                  {/* Status text */}
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground sm:mt-4 sm:text-sm">
                    <span className="inline-block h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    <span>Scanning 12,480 verified tutors…</span>
                  </div>
                </div>
              )}

              {/* Found result */}
              <AnimatePresence>
                {phase === "found" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 sm:mt-6"
                  >
                    <div className="rounded-xl border border-border bg-background p-3 sm:rounded-2xl sm:p-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl">
                          <img
                            src={matchedTutor.img}
                            alt={matchedTutor.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground ring-2 ring-background">
                            ✓
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-sm font-bold sm:text-base">
                            {matchedTutor.name}
                          </h3>
                          <p className="text-xs text-muted-foreground sm:text-sm">
                            {matchedTutor.subject} • ★ {matchedTutor.rating}
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-success sm:text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            Available now
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
                      <Link
                        to="/tutors"
                        onClick={onClose}
                        className="rounded-full bg-primary px-4 py-2.5 text-center text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:py-3 sm:text-sm"
                      >
                        Connect
                      </Link>
                      <Link
                        to="/tutors"
                        onClick={onClose}
                        className="rounded-full border border-border bg-card px-4 py-2.5 text-center text-xs font-semibold transition-colors hover:border-primary sm:py-3 sm:text-sm"
                      >
                        View more tutors
                      </Link>
                    </div>
                    <Link
                      to="/subjects"
                      onClick={onClose}
                      className="mt-2 block rounded-full border border-border bg-card px-4 py-2.5 text-center text-xs font-semibold transition-colors hover:border-primary sm:mt-3 sm:py-3 sm:text-sm"
                    >
                      Browse subjects
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
