import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

const fadeUpStagger = (index: number, total: number = 4) => ({
  ...fadeUp,
  transition: { duration: 0.5, delay: index * 0.08, ease: easeOutExpo },
});

export function LogoMarquee() {
  const items = [
    "IIT Bombay",
    "BITS Pilani",
    "Delhi University",
    "NIT Trichy",
    "IIM Ahmedabad",
    "Cambridge",
    "Stanford",
    "Oxford",
  ];
  const row = [...items, ...items, ...items, ...items];
  return (
    <section className="border-y border-border/60 bg-card/40 py-8 sm:py-10">
      <p className="container-px mx-auto mb-4 max-w-7xl text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:mb-5 sm:text-xs sm:tracking-[0.25em]">
        Tutors from the world&apos;s most respected institutions
      </p>
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap font-display text-sm font-bold text-muted-foreground/60 sm:gap-12 sm:text-base md:text-lg">
          {row.map((n, i) => (
            <span key={i} className="inline-flex items-center gap-8 sm:gap-12">
              <span>{n}</span>
              <span className="text-primary/30 text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  const stats = [
    { v: "50K+", l: "Active students" },
    { v: "12K+", l: "Verified tutors" },
    { v: "4.9★", l: "Average rating" },
    { v: "180+", l: "Subjects covered" },
  ];
  return (
    <section className="container-px mx-auto max-w-7xl py-16 sm:py-24 md:py-32">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:rounded-[2rem] md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            {...fadeUpStagger(i)}
            className="bg-card p-8 text-center sm:p-12 md:p-14"
          >
            <div className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-gradient">{s.v}</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-muted-foreground sm:mt-3 sm:text-sm">
              {s.l}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      t: "Verified tutors only",
      d: "Every tutor passes a 7-step verification including ID, qualifications, demo class & background check.",
      icon: "🛡️",
    },
    {
      t: "Match in seconds",
      d: "Our AI pairs you with the perfect tutor based on goals, learning style, schedule & budget.",
      icon: "⚡",
    },
    {
      t: "Online or nearby",
      d: "Choose 1:1 video sessions or in-person tutors near your locality, all in one app.",
      icon: "🌍",
    },
    {
      t: "Money-back guarantee",
      d: "Not satisfied with your first class? Full refund, no questions asked. We earn your trust.",
      icon: "💎",
    },
    {
      t: "Track real progress",
      d: "Beautiful weekly reports show test scores, time spent, topics mastered & next milestones.",
      icon: "📈",
    },
    {
      t: "Flexible pricing",
      d: "Pay per session or save with bundles. Transparent pricing, no hidden fees, ever.",
      icon: "💸",
    },
  ];
  return (
    <section id="features" className="container-px mx-auto max-w-7xl py-16 sm:py-24 md:py-32">
      <SectionHeader
        eyebrow="Why SeekhoSaath"
        title="A learning experience designed to feel personal."
        subtitle="Built with the care and craft you'd expect from the best products in the world."
      />
      <div className="mt-14 grid gap-5 sm:mt-20 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.t}
            {...fadeUpStagger(i, 6)}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)] sm:p-9"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-2xl sm:h-14 sm:w-14 sm:rounded-3xl sm:text-3xl transition-transform duration-500 group-hover:scale-110">
              {f.icon}
            </div>
            <h3 className="mt-5 font-display text-xl font-bold sm:mt-6 sm:text-2xl">{f.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{f.d}</p>
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Subjects() {
  const subjects = [
    { n: "Mathematics", c: "1,240 tutors", emoji: "📐", color: "from-blue-50 to-blue-100/50" },
    { n: "Physics", c: "892 tutors", emoji: "⚛️", color: "from-purple-50 to-purple-100/50" },
    { n: "Chemistry", c: "734 tutors", emoji: "🧪", color: "from-green-50 to-green-100/50" },
    { n: "English", c: "2,108 tutors", emoji: "📚", color: "from-amber-50 to-amber-100/50" },
    { n: "Computer Science", c: "654 tutors", emoji: "💻", color: "from-sky-50 to-sky-100/50" },
    { n: "Biology", c: "512 tutors", emoji: "🧬", color: "from-rose-50 to-rose-100/50" },
    { n: "Economics", c: "388 tutors", emoji: "📊", color: "from-orange-50 to-orange-100/50" },
    { n: "Music", c: "271 tutors", emoji: "🎵", color: "from-pink-50 to-pink-100/50" },
  ];
  return (
    <section id="subjects" className="container-px mx-auto max-w-7xl py-16 sm:py-24 md:py-32">
      <div className="flex flex-col items-start justify-between gap-5 sm:gap-6 md:flex-row md:items-end">
        <SectionHeader
          align="left"
          eyebrow="Subjects"
          title="Mastery, in any subject you can imagine."
          subtitle="From quantum physics to creative writing — find tutors for 180+ subjects."
        />
        <Link
          to="/subjects"
          className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-bold transition-all hover:border-primary hover:shadow-[var(--shadow-soft)] sm:px-6 sm:py-3 sm:text-base"
        >
          See all subjects →
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {subjects.map((s, i) => (
          <motion.div key={s.n} {...fadeUpStagger(i, 8)}>
            <Link
              to="/subjects/$subjectId"
              params={{ subjectId: s.n.toLowerCase().replace(/[^a-z0-9]+/g, "-") }}
              className="group flex items-center justify-between rounded-2xl border border-border bg-gradient-to-br bg-card p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-premium)] sm:rounded-3xl sm:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-2xl sm:h-14 sm:w-14 sm:rounded-3xl sm:text-3xl transition-transform duration-500 group-hover:scale-110">
                  {s.emoji}
                </div>
                <div>
                  <div className="font-display text-sm font-bold sm:text-base">{s.n}</div>
                  <div className="text-[11px] text-muted-foreground sm:text-xs">{s.c}</div>
                </div>
              </div>
              <span className="hidden text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary sm:inline text-lg">
                →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Tutors() {
  const tutors = [
    {
      name: "Aanya Rajput",
      subj: "Physics • IIT-JEE",
      price: "₹699",
      rating: 4.9,
      sessions: 1200,
      img: tutor1,
    },
    {
      name: "Rahul Mehta",
      subj: "Mathematics • Class 8-12",
      price: "₹599",
      rating: 4.8,
      sessions: 940,
      img: tutor2,
    },
    {
      name: "Sara Khanna",
      subj: "Chemistry • NEET",
      price: "₹749",
      rating: 5.0,
      sessions: 1480,
      img: tutor3,
    },
    {
      name: "Dev Patel",
      subj: "Spoken English",
      price: "₹499",
      rating: 4.9,
      sessions: 2100,
      img: tutor4,
    },
  ];
  return (
    <section id="tutors" className="container-px mx-auto max-w-7xl py-16 sm:py-24 md:py-32">
      <div className="flex flex-col items-start justify-between gap-5 sm:gap-6 md:flex-row md:items-end">
        <SectionHeader
          align="left"
          eyebrow="Top tutors"
          title="Loved by students. Vetted by us."
          subtitle="Hand-picked tutors with proven track records and 5-star reviews."
        />
        <Link
          to="/tutors"
          className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-bold transition-all hover:border-primary hover:shadow-[var(--shadow-soft)] sm:px-6 sm:py-3 sm:text-base"
        >
          See all tutors →
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {tutors.map((t, i) => (
          <motion.article
            key={t.name}
            {...fadeUpStagger(i, 4)}
            className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]"
          >
            <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
              <img
                src={t.img}
                alt={t.name}
                loading="lazy"
                width={400}
                height={500}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1.5 text-xs font-bold backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:py-2 sm:text-sm shadow-lg">
                ★ {t.rating}
              </div>
              <div
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-primary text-base text-primary-foreground shadow-lg sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-lg"
                title="Verified"
              >
                ✓
              </div>
              <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                <button className="w-full rounded-full bg-white/95 py-3 text-sm font-bold text-foreground backdrop-blur transition-all hover:bg-white sm:text-base">
                  View profile →
                </button>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="font-display text-lg font-bold sm:text-xl">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.subj}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 sm:mt-5 sm:pt-5">
                <div>
                  <div className="font-display text-lg font-bold sm:text-xl">
                    {t.price}
                    <span className="text-sm font-normal text-muted-foreground sm:text-base">
                      /Session
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">
                    {t.sessions}+ sessions
                  </div>
                </div>
                <button className="rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground sm:px-5 sm:py-3 sm:text-sm">
                  Book
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Tell us your goal",
      d: "Subject, class, schedule, budget — share what matters most to you.",
    },
    {
      n: "02",
      t: "Match instantly",
      d: "Our AI finds your top 3 tutors and starts a free 15-min discovery call.",
    },
    {
      n: "03",
      t: "Learn & grow",
      d: "Track progress, switch tutors anytime, celebrate every milestone.",
    },
  ];
  return (
    <section id="how" className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      <div className="bg-mesh absolute inset-0 -z-10 opacity-40" />
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeader eyebrow="How it works" title="From goal to growth in 3 simple steps." />
        <div className="mt-14 grid gap-5 sm:mt-20 sm:gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUpStagger(i, 3)}
              className="relative rounded-3xl border border-border bg-card p-7 sm:p-9 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]"
            >
              <div className="font-display text-5xl font-extrabold text-primary/15 sm:text-6xl md:text-7xl">
                {s.n}
              </div>
              <h3 className="mt-3 font-display text-xl font-bold sm:mt-4 sm:text-2xl md:text-3xl">
                {s.t}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const items = [
    {
      q: "I went from a 62% to a 91% in Physics in just one term. My tutor truly cared.",
      n: "Ishita S.",
      r: "Class 12, Mumbai",
    },
    {
      q: "The matching felt magical. Within an hour I was learning Calculus from a real IIT alumni.",
      n: "Aarav G.",
      r: "JEE Aspirant",
    },
    {
      q: "As a parent, I love the weekly reports. I finally know what's going on, with no nagging.",
      n: "Priya M.",
      r: "Parent, Bengaluru",
    },
    {
      q: "Switched 3 tutors before finding the perfect one — the platform made it effortless.",
      n: "Karan B.",
      r: "Class 10, Delhi",
    },
    {
      q: "Affordable, flexible, and the booking flow is the smoothest I've used.",
      n: "Neha R.",
      r: "College, Pune",
    },
    {
      q: "My English speaking confidence transformed in 6 weeks. Best decision I made.",
      n: "Rohan T.",
      r: "Working professional",
    },
  ];
  return (
    <section className="container-px mx-auto max-w-7xl py-16 sm:py-24 md:py-32">
      <SectionHeader
        eyebrow="Loved by 50,000+ learners"
        title="Stories that make us smile every day."
      />
      <div className="mt-14 grid gap-5 sm:mt-20 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <motion.figure
            key={i}
            {...fadeUpStagger(i, 6)}
            className="rounded-3xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)] sm:p-9"
          >
            <div className="flex gap-0.5 text-lg text-primary sm:text-xl">{"★★★★★"}</div>
            <blockquote className="mt-5 font-display text-base leading-snug sm:mt-6 sm:text-lg">
              &ldquo;{t.q}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4 border-t border-border pt-5 sm:mt-7 sm:pt-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-base font-bold text-primary sm:h-11 sm:w-11 sm:text-lg">
                {t.n[0]}
              </div>
              <div>
                <div className="text-sm font-bold sm:text-base">{t.n}</div>
                <div className="text-xs text-muted-foreground sm:text-sm">{t.r}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "Free",
      desc: "For students just exploring.",
      features: ["Browse all tutors", "1 free 15-min discovery call", "Basic progress tracking"],
      cta: "Get started",
      popular: false,
    },
    {
      name: "Learner",
      price: "₹1,499",
      per: "/mo",
      desc: "Most loved by serious students.",
      features: [
        "8 sessions/month",
        "Priority matching",
        "Weekly progress reports",
        "Switch tutors anytime",
      ],
      cta: "Start learning",
      popular: true,
    },
    {
      name: "Mastery",
      price: "₹3,999",
      per: "/mo",
      desc: "Unlimited learning, top tutors.",
      features: ["Unlimited sessions", "Top 1% tutors", "1:1 mentor & study plan", "24/7 support"],
      cta: "Go unlimited",
      popular: false,
    },
  ];
  return (
    <section id="pricing" className="container-px mx-auto max-w-7xl py-16 sm:py-24 md:py-32">
      <SectionHeader
        eyebrow="Pricing"
        title="Simple, transparent, fair."
        subtitle="Cancel anytime. No hidden fees. Money-back guaranteed."
      />
      <div className="mt-14 grid gap-5 sm:mt-20 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            {...fadeUpStagger(i, 3)}
            className={`relative rounded-3xl border-2 p-7 sm:p-9 transition-all duration-500 hover:-translate-y-1 ${
              t.popular
                ? "border-primary bg-foreground text-background shadow-[var(--shadow-glow)]"
                : "border-border bg-card hover:shadow-[var(--shadow-premium)]"
            }`}
          >
            {t.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground sm:text-xs">
                Most popular
              </span>
            )}
            <h3 className="font-display text-lg font-bold sm:text-xl">{t.name}</h3>
            <p
              className={`mt-2 text-sm sm:text-base ${t.popular ? "text-background/70" : "text-muted-foreground"}`}
            >
              {t.desc}
            </p>
            <div className="mt-5 flex items-end gap-1.5 sm:mt-6">
              <span className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                {t.price}
              </span>
              {t.per && (
                <span
                  className={`mb-1.5 text-sm sm:mb-2 sm:text-base ${t.popular ? "text-background/70" : "text-muted-foreground"}`}
                >
                  {t.per}
                </span>
              )}
            </div>
            <ul className="mt-6 space-y-3 text-sm sm:mt-8 sm:space-y-4">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs sm:h-6 sm:w-6 sm:text-sm ${t.popular ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"}`}
                  >
                    ✓
                  </span>
                  <span className="text-sm sm:text-base">{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-7 w-full rounded-full px-5 py-3.5 text-base font-bold transition-all duration-300 hover:-translate-y-0.5 sm:mt-8 sm:py-4 sm:text-lg ${
                t.popular
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {t.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function FAQ() {
  const items = [
    {
      q: "How does the tutor matching work?",
      a: "Tell us your subject, class, goal, and schedule. Our AI matches you with 3 ideal tutors in under 30 seconds, complete with a free discovery call.",
    },
    {
      q: "Are the tutors really verified?",
      a: "Yes — every tutor passes a 7-step verification: ID, qualifications, demo class, peer reviews, background check, communication test, and a probation period.",
    },
    {
      q: "What if I don't like my tutor?",
      a: "Switch instantly, no fees. We also offer a 100% money-back guarantee on your first paid session if it doesn't meet expectations.",
    },
    {
      q: "Can I learn online and in person?",
      a: "Both. Filter by online-only, in-person near you, or hybrid. The choice is always yours.",
    },
    {
      q: "How does pricing work?",
      a: "You can pay per session or subscribe to monthly bundles. All pricing is transparent — what you see is what you pay.",
    },
  ];
  return (
    <section id="faq" className="container-px mx-auto max-w-4xl py-16 sm:py-24 md:py-32">
      <SectionHeader eyebrow="FAQ" title="Questions, answered." />
      <div className="mt-10 divide-y divide-border rounded-3xl border-2 border-border bg-card sm:mt-14">
        {items.map((it, i) => (
          <details key={i} className="group p-5 sm:p-7 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold sm:text-lg">
              {it.q}
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-sm text-muted-foreground transition-transform duration-300 group-open:rotate-45 sm:h-9 sm:w-9 sm:text-base">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
              {it.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section id="cta" className="container-px mx-auto max-w-7xl py-12 sm:py-16 md:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-foreground p-8 text-background sm:rounded-[2rem] sm:p-12 md:p-20">
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/50 blur-3xl sm:-right-32 sm:-top-32 sm:h-80 sm:w-80 sm:blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-primary/40 blur-3xl sm:-bottom-32 sm:-left-32 sm:h-80 sm:w-80 sm:blur-3xl"
        />
        <div className="relative grid items-center gap-8 sm:gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Your perfect tutor is <span className="text-gradient">one tap away.</span>
            </h2>
            <p className="mt-4 max-w-lg text-base text-background/70 sm:mt-6 sm:text-lg md:text-xl">
              Join 50,000+ students learning smarter every day on SeekhoSaath.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-background/20 bg-background/10 px-5 py-3.5 text-base text-background placeholder:text-background/50 outline-none focus:border-primary sm:px-6 sm:py-4 sm:text-lg"
            />
            <button className="rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 sm:px-8 sm:py-4 sm:text-lg">
              Start free →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { t: "Product", l: ["Features", "Pricing", "Tutors", "Subjects", "Mobile app"] },
    { t: "Company", l: ["About", "Careers", "Blog", "Press", "Contact"] },
    { t: "Resources", l: ["Help center", "Become a tutor", "Community", "Trust & safety"] },
    { t: "Legal", l: ["Privacy", "Terms", "Cookies", "Refunds"] },
  ];
  return (
    <footer className="border-t-2 border-border bg-card/40">
      <div className="container-px mx-auto max-w-7xl py-12 sm:py-16 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 md:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground sm:h-11 sm:w-11 sm:rounded-2xl">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-5 sm:w-5">
                  <path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M7 10v5c0 1 2 3 5 3s5-2 5-3v-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-display text-lg font-bold sm:text-xl">
                Seekho<span className="text-primary">Saath</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground sm:mt-5 sm:text-base">
              Learn together, grow together. The world&apos;s most loved tutoring platform — built
              with care from India for the world.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
            {cols.map((c) => (
              <div key={c.t}>
                <h4 className="font-display text-sm font-bold sm:text-base">{c.t}</h4>
                <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  {c.l.map((it) => (
                    <li key={it}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground sm:text-base"
                      >
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t-2 border-border pt-8 sm:mt-14 sm:flex-row sm:items-center sm:pt-10">
          <p className="text-xs text-muted-foreground sm:text-sm">
            © {new Date().getFullYear()} SeekhoSaath. Made with ❤ for learners everywhere.
          </p>
          <div className="flex gap-2 sm:gap-3">
            {["Twitter", "Instagram", "LinkedIn", "YouTube"].map((s) => (
              <a
                key={s}
                href="#"
                className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-semibold transition-all hover:border-primary hover:text-foreground sm:px-4 sm:text-sm"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="inline-block rounded-full border-2 border-border bg-card px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:mt-5 sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-muted-foreground sm:mt-5 sm:text-lg md:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
