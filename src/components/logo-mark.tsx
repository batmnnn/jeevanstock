export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 62 100" fill="none" aria-hidden className={className}>
      <rect x="17" y="3" width="28" height="11" rx="2.5" className="fill-brand" />
      <path
        d="M25 15v8L15 35v50a12 12 0 0 0 12 12h8a12 12 0 0 0 12-12V35L37 23v-8"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
