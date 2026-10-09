/** Placeholder shown while a database-backed list loads. Reserves space so the page does not jump. */
export function ListSkeleton({ label = "Loading" }: { label?: string }) {
  return (
    <section className="bg-paper py-16 sm:py-20" aria-busy="true">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="sr-only" role="status">
          {label}
        </p>
        <div className="h-10 w-2/3 max-w-md animate-pulse rounded-control bg-deep/10 motion-reduce:animate-none" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-64 animate-pulse rounded-card bg-deep/10 motion-reduce:animate-none" />
          ))}
        </ul>
      </div>
    </section>
  );
}
