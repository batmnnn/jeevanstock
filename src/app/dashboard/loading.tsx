export default function DashboardLoading() {
  return (
    <main id="main" tabIndex={-1} aria-busy="true" className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10">
      <div className="h-12 w-2/3 max-w-md animate-pulse rounded-xl bg-line" />
      <div className="mt-4 h-6 w-full max-w-xl animate-pulse rounded-lg bg-line" />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-[var(--radius-card)] bg-line" />
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-[var(--radius-card)] bg-line" />
        ))}
      </div>
    </main>
  );
}
