import type { Product } from "@/content/products";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadges } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

function Facts({ product }: { product: Product }) {
  const hasProblem = Boolean(product.problem);
  const hasUsers = product.users.length > 0;
  if (!hasProblem && !hasUsers && product.scope.length === 0) return null;
  return (
    <dl className="space-y-5">
      {hasProblem ? (
        <div>
          <dt className="font-sans text-sm font-semibold">Problem solved</dt>
          <dd className="mt-1 text-[0.9375rem] leading-relaxed text-deep/80 line-clamp-6">{product.problem}</dd>
        </div>
      ) : null}
      {hasUsers ? (
        <div>
          <dt className="font-sans text-sm font-semibold">Target users</dt>
          <dd className="mt-1 text-[0.9375rem] leading-relaxed text-deep/80">{product.users.join(", ")}</dd>
        </div>
      ) : null}
      {!hasProblem && !hasUsers && product.scope.length > 0 ? (
        <div>
          <dt className="font-sans text-sm font-semibold">Includes</dt>
          <dd className="mt-1 text-[0.9375rem] leading-relaxed text-deep/80">{product.scope.slice(0, 6).join(", ")}</dd>
        </div>
      ) : null}
    </dl>
  );
}

/**
 * Solid border = exists in some form (MVP / live).
 * Dashed border = proposed or future, not yet built.
 */
export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const Icon = product.icon;
  const built = product.group !== "future";

  return (
    <article
      className={cn(
        "lift flex h-full rounded-card p-6 sm:p-8",
        built ? "border border-deep/20 bg-white" : "border border-dashed border-deep/40 bg-transparent",
        featured ? "flex-col gap-8 lg:flex-row lg:gap-14" : "flex-col",
      )}
    >
      <div className={cn("flex flex-col", featured && "lg:w-1/2")}>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid h-11 w-11 place-items-center rounded-lg",
              built ? "bg-deep text-white" : "border border-deep/30 text-deep",
            )}
          >
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <p className="font-sans text-sm font-medium text-deep/75">{product.category}</p>
        </div>

        <h3 className="mt-6 font-sans text-2xl font-semibold leading-tight tracking-[-0.015em] text-balance">{product.name}</h3>
        <StatusBadges statuses={product.badges} className="mt-3" />
        <p className="mt-4 text-base leading-relaxed text-deep/80">{product.summary}</p>

        {product.technologies && product.technologies.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${product.name}: technologies`}>
            {product.technologies.map((tech) => (
              <li key={tech} className="rounded-md border border-deep/25 px-2.5 py-1 font-sans text-[0.8125rem] font-medium leading-snug">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-7">
          <ButtonLink href={`/products/${product.slug}`} variant={built ? "dark" : "outline"}>
            Learn More<span className="sr-only"> about {product.name}</span>
          </ButtonLink>
          {product.url ? (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 inline-flex min-h-11 items-center font-sans text-[0.9375rem] font-semibold underline underline-offset-4"
            >
              Visit project<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>

      <div className={cn(featured ? "lg:w-1/2 lg:border-l lg:border-deep/15 lg:pl-14" : "mt-7 border-t border-deep/15 pt-6")}>
        <Facts product={product} />
      </div>
    </article>
  );
}
