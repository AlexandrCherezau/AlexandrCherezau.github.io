/** Inline icons (stroke = currentColor). Kept tiny on purpose. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className ?? "h-4 w-4"} aria-hidden>
      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-5 w-5"} aria-hidden>
      <path
        fill="currentColor"
        d="M21.9 4.6 18.8 19.3c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.9 13.3 2.4 11.9c-1-.3-1-1 .2-1.5L20.6 3.5c.8-.3 1.6.2 1.3 1.1Z"
      />
    </svg>
  );
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className ?? "h-4 w-4"} aria-hidden>
      <path fill="currentColor" d="m10 1.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8L10 1.5Z" />
    </svg>
  );
}
