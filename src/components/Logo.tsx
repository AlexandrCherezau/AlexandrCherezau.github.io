/** Wordmark: a single keycap with a key-hole, plus the brand name. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className ?? "h-8 w-8"} aria-hidden>
      <rect x="2" y="3" width="28" height="26" rx="7" fill="#2a3b33" />
      <rect x="5" y="5" width="22" height="19" rx="5" fill="#f5c542" />
      <circle cx="16" cy="12.5" r="3" fill="#0e1613" />
      <path d="M14.6 14.5h2.8l.9 5.5h-4.6l.9-5.5Z" fill="#0e1613" />
    </svg>
  );
}
