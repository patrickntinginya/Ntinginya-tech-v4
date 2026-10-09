import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { innovationTopics, getInnovationTopic } from "@/lib/innovation";
import { listInnovationPosts } from "@/lib/cms/public";
import { cn } from "@/lib/cn";
import { InnovationCard } from "./InnovationCard";

function hrefFor(topic?: string, page?: number): string {
  const sp = new URLSearchParams();
  if (topic) sp.set("topic", topic);
  if (page && page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `/innovation?${qs}` : "/innovation";
}

/** CMS-driven Innovation Hub feed with topic filters. Reads published articles tagged with an Innovation topic. */
export async function InnovationFeed({ topicSlug, page = 1 }: { topicSlug?: string; page?: number }) {
  const topic = getInnovationTopic(topicSlug);
  const { posts, pageCount, page: current } = await listInnovationPosts({ topicTag: topic?.tag, page, pageSize: 9 });

  return (
    <div>
      <nav aria-label="Innovation topics">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={hrefFor()}
              aria-current={!topic ? "true" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-control border px-3.5 font-sans text-sm font-medium transition-colors duration-base",
                !topic ? "border-deep bg-deep text-white" : "border-deep/30 hover:bg-deep/5",
              )}
            >
              All topics
            </Link>
          </li>
          {innovationTopics.map((t) => (
            <li key={t.slug}>
              <Link
                href={hrefFor(t.slug)}
                aria-current={topic?.slug === t.slug ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-control border px-3.5 font-sans text-sm font-medium transition-colors duration-base",
                  topic?.slug === t.slug ? "border-deep bg-deep text-white" : "border-deep/30 hover:bg-deep/5",
                )}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10">
        {posts.length === 0 ? (
          <EmptyState title={topic ? `No ${topic.label} articles yet.` : "No innovation articles have been published yet."}>
            <p>
              Articles will appear here as they are published. You can also read everything we have published in{" "}
              <Link href="/news" className="font-semibold underline underline-offset-4">
                News &amp; Insights
              </Link>
              .
            </p>
          </EmptyState>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <li key={post.id} className="reveal flex">
                <div className="w-full">
                  <InnovationCard post={post} priority={i === 0 && current === 1} />
                </div>
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 ? (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4 font-sans text-sm font-semibold">
            {current > 1 ? (
              <Link href={hrefFor(topic?.slug, current - 1)} className="inline-flex min-h-11 items-center underline underline-offset-4">
                Newer articles
              </Link>
            ) : (
              <span />
            )}
            <span className="text-deep/70">
              Page {current} of {pageCount}
            </span>
            {current < pageCount ? (
              <Link href={hrefFor(topic?.slug, current + 1)} className="inline-flex min-h-11 items-center underline underline-offset-4">
                Older articles
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
