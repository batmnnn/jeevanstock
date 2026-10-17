export default function VerifyLoading() {
  return (
    <main id="main" aria-busy="true" className="mx-auto w-full max-w-2xl px-4 pb-20 pt-6 sm:px-6">
      <div className="h-8 w-24 animate-pulse rounded-lg bg-line" />
      <div className="mt-4 h-80 animate-pulse rounded-[var(--radius-card)] bg-line" />
    </main>
  );
}
