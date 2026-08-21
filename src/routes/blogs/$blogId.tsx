"use client";

import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { getBlogById, blogs } from "@/data/blogs";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/blogs/$blogId")({
  head: () => ({
    meta: [
      { title: "Blog — SeekhoSaath" },
      {
        name: "description",
        content: "Read the latest articles on tutoring, study tips, exam prep, and learning strategies.",
      },
    ],
  }),
  loader: ({ params }) => {
    const blog = getBlogById(params.blogId);
    if (!blog) throw notFound();
    return blog;
  },
  component: BlogDetailPage,
});

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function RelatedImage({ blog }: { blog: (typeof blogs)[0] }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth !== 0) {
      setLoaded(true);
    } else {
      const handleLoad = () => setLoaded(true);
      const handleError = () => setError(true);
      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);
      return () => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleError);
      };
    }
  }, []);

  return (
    <>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/60" />
      )}
      <img
        ref={imgRef}
        src={error ? "/hero-tutor-rounded.jpg" : blog.image}
        alt={blog.title}
        className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}

function BlogDetailPage() {
  const blog = Route.useLoaderData() as Awaited<ReturnType<typeof Route.loader>>;
  const [readTimeLeft, setReadTimeLeft] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const mainImgRef = useRef<HTMLImageElement>(null);

  const relatedBlogs = blogs.filter((b) => b.category === blog.category && b.id !== blog.id).slice(0, 3);

  useEffect(() => {
    const img = mainImgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth !== 0) {
      setImgLoaded(true);
    } else {
      const handleLoad = () => setImgLoaded(true);
      const handleError = () => setImgError(true);
      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);
      return () => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleError);
      };
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [blog.id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadTimeLeft(Math.max(0, 100 - Math.round(progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
      <main className="min-h-screen bg-background text-foreground pb-safe pt-14 sm:pt-16">
      <Navbar />

      <div className="fixed inset-x-0 top-0 z-[9998] h-1 bg-border">
        <div
          className="h-full bg-gradient-to-r from-crimson to-ember transition-all duration-300"
          style={{ width: `${100 - readTimeLeft}%` }}
        />
      </div>

      <article className="container-px mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-crimson transition-colors sm:text-base"
        >
          ← All blogs
        </Link>

        <header className="mt-4 sm:mt-5 mb-6 sm:mb-8">
          <span className="text-[10px] font-bold uppercase tracking-wider text-crimson sm:text-xs">{blog.category}</span>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">{blog.title}</h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">{blog.excerpt}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-crimson to-ember sm:h-9 sm:w-9"></div>
              <div>
                <div className="text-sm font-bold sm:text-base">{blog.author}</div>
                <div className="text-[10px] text-muted-foreground sm:text-xs">{blog.readTime}</div>
              </div>
            </div>
            <div className="h-4 w-px bg-border sm:h-5"></div>
            <div className="text-xs text-muted-foreground sm:text-sm">
              {formatDate(blog.date)}
              {blog.updatedAt && (
                <span className="ml-2 text-[10px] text-muted-foreground/80 sm:text-xs">
                  (Updated: {formatDate(blog.updatedAt)})
                </span>
              )}
            </div>
            {blog.trending && (
              <>
                <div className="h-4 w-px bg-border sm:h-5"></div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 px-2.5 py-1 text-[10px] font-bold text-crimson sm:text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson"></span>
                  </span>
                  Trending
                </span>
              </>
            )}
          </div>
        </header>

        <div className="mt-6 sm:mt-8 overflow-hidden rounded-2xl border-2 border-border sm:rounded-3xl bg-muted relative">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/60" />
          )}
          <img
            ref={mainImgRef}
            src={imgError ? "/hero-tutor-rounded.jpg" : blog.image}
            alt={blog.title}
            className={`aspect-video w-full object-cover transition-opacity duration-500 ${imgLoaded || imgError ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        <div className="prose prose-slate mt-6 sm:mt-8 max-w-none">
          <div className="text-sm leading-relaxed text-foreground/90 sm:text-base space-y-4">
            {blog.content.split("\n\n").map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={idx} className="font-display text-xl font-bold mt-6 sm:mt-8 mb-2 sm:mb-3">
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={idx} className="font-display text-lg font-bold mt-4 sm:mt-6 mb-2">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              if (trimmed.startsWith("- **")) {
                const items = trimmed.split("\n").filter((line) => line.startsWith("- "));
                return (
                  <ul key={idx} className="mt-3 space-y-1.5 sm:space-y-2 ml-4">
                    {items.map((item, i) => (
                      <li key={i} className="text-sm sm:text-base" dangerouslySetInnerHTML={{
                        __html: item
                          .replace(/^- /, "")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      }} />
                    ))}
                  </ul>
                );
              }

              if (/^\d+\./.test(trimmed)) {
                const items = trimmed.split("\n").filter((line) => /^\d+\./.test(line));
                return (
                  <ol key={idx} className="mt-3 space-y-1.5 sm:space-y-2 ml-4 list-decimal">
                    {items.map((item, i) => (
                      <li key={i} className="text-sm sm:text-base" dangerouslySetInnerHTML={{
                        __html: item
                          .replace(/^\d+\. /, "")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      }} />
                    ))}
                  </ol>
                );
              }

              return (
                <p key={idx} className="text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{
                  __html: trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                }} />
              );
            })}
          </div>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-2 sm:gap-3 border-t-2 border-border pt-6 sm:pt-8">
          <span className="text-xs font-bold text-muted-foreground sm:text-sm">Share this article:</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
            className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-bold transition-all hover:border-crimson hover:text-crimson sm:px-4 sm:py-2 sm:text-sm"
          >
            Copy Link
          </button>
        </div>
      </article>

      {relatedBlogs.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-8 sm:py-10 md:py-14">
          <h2 className="font-display text-xl font-bold sm:text-2xl md:text-3xl mb-4 sm:mb-6">Related Articles</h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedBlogs.map((related) => (
              <Link
                key={related.id}
                to={`/blogs/${related.id}`}
                className="group block overflow-hidden rounded-2xl border-2 border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-crimson/30 hover:shadow-[var(--shadow-premium)] sm:rounded-3xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9] bg-muted">
                  <RelatedImage blog={related} />
                </div>
                <div className="p-3.5 sm:p-4">
                  <h3 className="font-display text-base font-bold sm:text-lg">{related.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm line-clamp-2">{related.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
