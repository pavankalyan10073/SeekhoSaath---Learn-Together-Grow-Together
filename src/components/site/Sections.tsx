import { Link } from "@tanstack/react-router";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";

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
    <section className="border-y-2 border-border/60 bg-gradient-to-r from-crimson/5 via-card to-ember/5 py-6 sm:py-8">
      <p className="container-px mx-auto mb-3 max-w-7xl text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
        Tutors from the world&apos;s most respected institutions
      </p>
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap font-display text-sm font-bold text-muted-foreground/70 sm:gap-8 sm:text-base md:text-lg">
          {row.map((n, i) => (
            <span key={i} className="inline-flex items-center gap-6 sm:gap-8">
              <span>{n}</span>
              <span className="text-crimson/50 text-xs">✦</span>
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
    <section className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border sm:rounded-3xl md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.l}
            className="bg-card p-5 text-center sm:p-8 md:p-10"
          >
            <div className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="text-gradient">{s.v}</span>
            </div>
            <div className="mt-1.5 text-xs font-semibold text-muted-foreground sm:mt-2 sm:text-sm">
              {s.l}
            </div>
          </div>
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
    <section id="features" className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
      <SectionHeader
        eyebrow="Why SeekhoSaath"
        title="A learning experience designed to feel personal."
        subtitle="Built with the care and craft you'd expect from the best products in the world."
      />
      <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={f.t}
            className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-crimson/30 hover:shadow-[var(--shadow-premium)] sm:rounded-3xl sm:p-7"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 via-transparent to-ember/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-crimson/10 to-ember/10 text-xl sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl transition-transform duration-500 group-hover:scale-110 relative z-10">
              {f.icon}
            </div>
            <h3 className="mt-3 font-display text-base font-bold sm:mt-4 sm:text-lg relative z-10">
              {f.t}
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm relative z-10">{f.d}</p>
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Subjects() {
  const subjects = [
    { n: "Mathematics", c: "1,240 tutors", emoji: "📐", id: "math-6-10" },
    { n: "Physics", c: "892 tutors", emoji: "⚛️", id: "physics-6-10" },
    { n: "Chemistry", c: "734 tutors", emoji: "🧪", id: "chemistry-6-10" },
    { n: "English", c: "2,108 tutors", emoji: "📚", id: "english-6-10" },
    { n: "Computer Science", c: "654 tutors", emoji: "💻", id: "computer-6-10" },
    { n: "Biology", c: "512 tutors", emoji: "🧬", id: "biology-6-10" },
    { n: "Economics", c: "388 tutors", emoji: "📊", id: "economics-11-12" },
    { n: "Music", c: "271 tutors", emoji: "🎵", id: "music" },
  ];
  return (
    <section id="subjects" className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:gap-5 md:flex-row md:items-end">
        <SectionHeader
          align="left"
          eyebrow="Subjects"
          title="Mastery, in any subject you can imagine."
          subtitle="From quantum physics to creative writing — find tutors for 180+ subjects."
        />
        <Link
          to="/subjects"
          className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold transition-all hover:border-crimson hover:text-crimson hover:shadow-[var(--shadow-soft)] sm:px-5 sm:py-2.5 sm:text-base"
        >
          See all subjects →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {subjects.map((s, i) => (
          <div key={s.id}>
            <Link
              to="/subjects/$subjectId"
              params={{ subjectId: s.id }}
              className="group flex items-center justify-between rounded-xl border-2 border-border bg-card p-3 transition-all duration-500 hover:-translate-y-0.5 hover:border-crimson/40 hover:shadow-[var(--shadow-premium)] sm:rounded-2xl sm:p-4"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-crimson/10 to-ember/10 text-xl sm:h-11 sm:w-11 sm:rounded-xl sm:text-2xl transition-transform duration-500 group-hover:scale-110">
                  {s.emoji}
                </div>
                <div>
                  <div className="font-display text-sm font-bold sm:text-base">{s.n}</div>
                  <div className="text-[10px] text-muted-foreground sm:text-xs">{s.c}</div>
                </div>
              </div>
              <span className="hidden text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-crimson sm:inline">
                →
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Tutors() {
  const tutors = [
    {
      id: "aanya-rajput",
      name: "Aanya Rajput",
      subj: "Physics • IIT-JEE",
      price: "₹699",
      rating: 4.9,
      sessions: 1200,
      img: tutor1,
    },
    {
      id: "rahul-mehta",
      name: "Rahul Mehta",
      subj: "Mathematics • Class 8-12",
      price: "₹599",
      rating: 4.8,
      sessions: 940,
      img: tutor2,
    },
    {
      id: "sara-khanna",
      name: "Sara Khanna",
      subj: "Chemistry • NEET",
      price: "₹749",
      rating: 5.0,
      sessions: 1480,
      img: tutor3,
    },
    {
      id: "dev-patel",
      name: "Dev Patel",
      subj: "Spoken English",
      price: "₹499",
      rating: 4.9,
      sessions: 2100,
      img: tutor4,
    },
  ];
  return (
    <section id="tutors" className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:gap-5 md:flex-row md:items-end">
        <SectionHeader
          align="left"
          eyebrow="Top tutors"
          title="Loved by students. Vetted by us."
          subtitle="Hand-picked tutors with proven track records and 5-star reviews."
        />
        <Link
          to="/tutors"
          className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold transition-all hover:border-crimson hover:text-crimson hover:shadow-[var(--shadow-soft)] sm:px-5 sm:py-2.5 sm:text-base"
        >
          See all tutors →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {tutors.map((t, i) => (
          <Link
            key={t.id}
            to="/tutors/$tutorId"
            params={{ tutorId: t.id }}
            className="group block overflow-hidden rounded-2xl border-2 border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-crimson/30 hover:shadow-[var(--shadow-premium)] sm:rounded-3xl"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute left-2.5 top-2.5 rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-bold backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs shadow-lg">
                ★ {t.rating}
              </div>
              <div
                className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-crimson to-ember text-sm text-primary-foreground shadow-lg sm:right-3 sm:top-3 sm:h-9 sm:w-9 sm:text-base"
                title="Verified"
              >
                ✓
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
                <span className="inline-flex w-full items-center justify-center rounded-full bg-white/95 px-4 py-2.5 text-sm font-bold text-foreground backdrop-blur transition-all hover:bg-white sm:text-base">
                  View profile →
                </span>
              </div>
            </div>
            <div className="p-3.5 sm:p-4">
              <h3 className="font-display text-base font-bold sm:text-lg">{t.name}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{t.subj}</p>
              <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5 sm:mt-3 sm:pt-3">
                <div>
                  <div className="font-display text-base font-bold sm:text-lg">
                    {t.price}
                    <span className="text-xs font-normal text-muted-foreground sm:text-sm">
                      /Session
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground sm:text-xs">
                    {t.sessions}+ sessions
                  </div>
                </div>
                <span className="rounded-full bg-navy px-3 py-2 text-[11px] font-bold text-white transition-all hover:bg-crimson hover:shadow-lg sm:px-4 sm:py-2.5 sm:text-xs">
                  Book
                </span>
              </div>
            </div>
          </Link>
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
    <section id="how" className="relative overflow-hidden py-10 sm:py-14 md:py-20">
      <div className="bg-mesh absolute inset-0 -z-10 opacity-40" />
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeader eyebrow="How it works" title="From goal to growth in 3 simple steps." />
        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-2xl border-2 border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-crimson/30 hover:shadow-[var(--shadow-premium)] sm:rounded-3xl sm:p-7"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 via-transparent to-ember/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="font-display text-4xl font-extrabold text-crimson/15 sm:text-5xl md:text-6xl relative z-10">
                {s.n}
              </div>
              <h3 className="mt-2 font-display text-base font-bold sm:mt-3 sm:text-lg md:text-xl relative z-10">
                {s.t}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm relative z-10">{s.d}</p>
            </div>
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
    <section className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
      <SectionHeader
        eyebrow="Loved by 50,000+ learners"
        title="Stories that make us smile every day."
      />
      <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <figure
            key={i}
            className="rounded-2xl border-2 border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-crimson/30 hover:shadow-[var(--shadow-premium)] sm:rounded-3xl sm:p-6"
          >
            <div className="flex gap-0.5 text-sm text-crimson sm:text-base">{"★★★★★"}</div>
            <blockquote className="mt-2.5 font-display text-sm leading-snug sm:mt-3 sm:text-base">
              &ldquo;{t.q}&rdquo;
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-3 border-t border-border pt-3 sm:mt-4 sm:pt-4">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-crimson/10 to-ember/10 text-sm font-bold text-crimson sm:h-9 sm:w-9 sm:text-base">
                {t.n[0]}
              </div>
              <div>
                <div className="text-sm font-bold sm:text-base">{t.n}</div>
                <div className="text-xs text-muted-foreground sm:text-sm">{t.r}</div>
              </div>
            </figcaption>
          </figure>
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
        "15 sessions/month",
        "Priority matching",
        "Weekly progress reports",
        "Switch tutors anytime",
      ],
      cta: "Start learning",
      popular: true,
    },
    {
      name: "Mastery",
      price: "₹2,499",
      per: "/mo",
      desc: "Advanced learning, top tutors.",
      features: ["30 sessions/month", "Top 1% tutors", "1:1 mentor & study plan", "24/7 support"],
      cta: "Start mastering",
      popular: false,
    },
  ];
  return (
    <section id="pricing" className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
      <SectionHeader
        eyebrow="Pricing"
        title="Simple, transparent, fair."
        subtitle="Cancel anytime. No hidden fees. Money-back guaranteed."
      />
      <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border-2 p-5 transition-all duration-500 hover:-translate-y-1 sm:rounded-3xl sm:p-7 ${
              t.popular
                ? "border-crimson bg-gradient-to-br from-crimson to-ember text-white shadow-[var(--shadow-glow)]"
                : "border-border bg-card hover:shadow-[var(--shadow-premium)]"
            }`}
          >
            {t.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-mint to-mint/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy sm:text-xs">
                Most popular
              </span>
            )}
            <h3 className="font-display text-base font-bold sm:text-lg">{t.name}</h3>
            <p
              className={`mt-1.5 text-xs sm:text-sm ${t.popular ? "text-white/80" : "text-muted-foreground"}`}
            >
              {t.desc}
            </p>
            <div className="mt-4 flex items-end gap-1.5 sm:mt-5">
              <span className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                {t.price}
              </span>
              {t.per && (
                <span
                  className={`mb-1 text-xs sm:mb-2 sm:text-sm ${t.popular ? "text-white/75" : "text-muted-foreground"}`}
                >
                  {t.per}
                </span>
              )}
            </div>
            <ul className="mt-5 space-y-2 text-xs sm:mt-6 sm:space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] sm:h-5 sm:w-5 sm:text-xs ${t.popular ? "bg-white text-crimson" : "bg-gradient-to-br from-crimson to-ember text-white"}`}
                  >
                    ✓
                  </span>
                  <span className="text-xs sm:text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-5 w-full rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 sm:mt-6 sm:py-3 sm:text-base ${
                t.popular
                  ? "bg-white text-crimson shadow-lg hover:shadow-xl"
                  : "bg-navy text-white hover:bg-crimson hover:shadow-lg"
              }`}
            >
              {t.cta}
            </button>
          </div>
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
    <section id="faq" className="container-px mx-auto max-w-4xl py-10 sm:py-14 md:py-20">
      <SectionHeader eyebrow="FAQ" title="Questions, answered." />
      <div className="mt-6 divide-y divide-border rounded-2xl border-2 border-border bg-card sm:mt-8 sm:rounded-3xl">
        {items.map((it, i) => (
          <details key={i} className="group p-4 sm:p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-sm font-bold sm:text-lg">
              {it.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-xs text-muted-foreground transition-all duration-300 group-open:rotate-45 group-open:bg-crimson group-open:text-white sm:h-8 sm:w-8 sm:text-sm">
                +
              </span>
            </summary>
            <p className="mt-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section id="cta" className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-crimson to-ember p-6 text-white sm:rounded-3xl sm:p-10 md:p-14 shadow-[var(--shadow-float)]">
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl sm:-right-24 sm:-top-24 sm:h-72 sm:w-72 sm:blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-mint/20 blur-2xl sm:-bottom-24 sm:-left-24 sm:h-72 sm:w-72 sm:blur-3xl"
        />
        <div className="relative grid items-center gap-6 sm:gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Your perfect tutor is <span className="text-gradient">one tap away.</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/75 sm:mt-4 sm:text-base md:text-lg">
              Join 50,000+ students learning smarter every day on SeekhoSaath.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2.5 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 rounded-full border-2 border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/60 backdrop-blur-sm sm:px-5 sm:py-3.5 sm:text-base"
            />
            <button className="rounded-full bg-white px-5 py-3 text-sm font-bold text-crimson shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:px-6 sm:py-3.5 sm:text-base">
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
    { t: "Product", l: [{ name: "Features", href: "/#features" }, { name: "Pricing", href: "/#pricing" }, { name: "Tutors", href: "/tutors" }, { name: "Subjects", href: "/subjects" }, { name: "Mobile app", href: "/#" }] },
    { t: "Company", l: [{ name: "About", href: "/#" }, { name: "Careers", href: "/#" }, { name: "Blog", href: "/blogs" }, { name: "Press", href: "/#" }, { name: "Contact", href: "/#" }] },
    { t: "Resources", l: [{ name: "Help center", href: "/#" }, { name: "Become a tutor", href: "/signup" }, { name: "Community", href: "/#" }, { name: "Trust & safety", href: "/#" }] },
    { t: "Legal", l: [{ name: "Privacy", href: "/privacy-policy" }, { name: "Terms", href: "/terms" }, { name: "Cookies", href: "/#" }, { name: "Refunds", href: "/refund-policy" }] },
  ];
  return (
    <footer className="border-t-2 border-border bg-gradient-to-b from-card/40 to-card/80">
      <div className="container-px mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5"
            >
              <img src="/hero-tutor-rounded.jpg" alt="SeekhoSaath" className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10" />
              <span className="font-display text-lg font-bold sm:text-xl">
                Seekho<span className="text-gradient">Saath</span>
              </span>
            </button>
            <p className="mt-3 max-w-sm text-xs text-muted-foreground sm:mt-4 sm:text-sm">
              Learn together, grow together. The world&apos;s most loved tutoring platform — built
              with care from India for the world.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {cols.map((c) => (
              <div key={c.t}>
                <h4 className="font-display text-xs font-bold sm:text-sm">{c.t}</h4>
                <ul className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
                  {c.l.map((it) => (
                    <li key={it.name}>
                      <a
                        href={it.href}
                        className="text-xs text-muted-foreground transition-colors hover:text-crimson sm:text-sm"
                      >
                        {it.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t-2 border-border pt-6 sm:mt-10 sm:flex-row sm:items-center sm:pt-8">
          <p className="text-[10px] text-muted-foreground sm:text-xs">
            © {new Date().getFullYear()} SeekhoSaath. Made with ❤ for learners everywhere.
          </p>
          <div className="flex gap-2 sm:gap-3">
            {["Twitter", "Instagram", "LinkedIn", "YouTube"].map((s) => (
              <a
                key={s}
                href="#"
                className="rounded-full border-2 border-border bg-card px-2.5 py-1 text-[10px] font-bold transition-all hover:border-crimson hover:text-crimson sm:px-3 sm:text-xs"
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
      <span className="inline-block rounded-full border-2 border-crimson/30 bg-crimson/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-crimson sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-2xl font-extrabold leading-[1.05] tracking-tight sm:mt-4 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2.5 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
