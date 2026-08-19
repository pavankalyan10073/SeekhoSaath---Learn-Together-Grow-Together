import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { blogs, getTrendingBlogs, getRecentBlogs } from "@/data/blogs";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/blogs/")({
  head: () => ({
    meta: [
      { title: "Blogs — SeekhoSaath" },
      {
        name: "description",
        content: "Latest articles on tutoring, study tips, exam preparation, and learning strategies.",
      },
    ],
  }),
  component: BlogsPage,
});

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function LiveTimeIndicator({ dateString }: { dateString: string }) {
  const [timeAgo, setTimeAgo] = useState(() => formatTimeAgo(dateString));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(dateString));
    }, 60000);
    return () => clearInterval(interval);
  }, [dateString]);

  return <span className="text-[10px] text-muted-foreground sm:text-xs">{timeAgo}</span>;
}

function BlogCard({ blog }: { blog: (typeof blogs)[0] }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Link
      to={`/blogs/${blog.id}`}
      className="group block overflow-hidden rounded-2xl border-2 border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-crimson/30 hover:shadow-[var(--shadow-premium)] sm:rounded-3xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9] bg-muted">
        {!loaded && !error && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/60" />
        )}
        <img
          src={error ? "/hero-tutor-rounded.jpg" : blog.image}
          alt={blog.title}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {blog.trending && (
          <div className="absolute left-2.5 top-2.5 rounded-full bg-crimson px-2.5 py-1 text-[10px] font-bold text-white sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
            Trending
          </div>
        )}
      </div>
      <div className="p-3.5 sm:p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-crimson sm:text-xs">{blog.category}</span>
        <h3 className="mt-1 font-display text-base font-bold sm:text-lg">{blog.title}</h3>
        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm line-clamp-2">{blog.excerpt}</p>
        <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5 sm:mt-3 sm:pt-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-crimson to-ember sm:h-7 sm:w-7"></div>
            <span className="text-[10px] font-bold text-muted-foreground sm:text-xs">{blog.author}</span>
          </div>
          <div className="text-right">
            <LiveTimeIndicator dateString={blog.date} />
            <div className="text-[10px] text-muted-foreground sm:text-xs">{blog.readTime}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function BlogsPage() {
  const trending = getTrendingBlogs();
  const recent = getRecentBlogs(20);

  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-10 sm:pt-12">
      <Navbar />

      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14">
        <div className="bg-mesh absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute -top-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-crimson/25 blur-3xl sm:-top-28 sm:h-[400px] sm:w-[400px] sm:blur-3xl"
        />
        <div className="container-px mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border-2 border-crimson/30 bg-crimson/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-crimson sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
              Blog
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl">
              Learn, <span className="text-gradient">grow</span>, and stay ahead.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              Expert tips on tutoring, exam prep, study skills, and more. Updated daily.
            </p>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      {trending.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-crimson"></span>
            </span>
            <h2 className="font-display text-xl font-bold sm:text-2xl md:text-3xl">Trending Now</h2>
          </div>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trending.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* All Blogs */}
      <section className="container-px mx-auto max-w-7xl py-6 sm:py-8 md:py-10">
        <h2 className="font-display text-xl font-bold sm:text-2xl md:text-3xl mb-4 sm:mb-6">All Articles</h2>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
