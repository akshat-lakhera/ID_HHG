import { cn } from '../lib/cn';

interface LogoProps {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  compact?: boolean;
}

/** House-from-two-H's mark: a lanyard pass with a roof. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect
        x="11"
        y="9"
        width="42"
        height="48"
        rx="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="32" cy="17.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M20 30.5 L32 22.5 L44 30.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <path
        d="M23 31.5 V48 M23 39.5 H30.5 M30.5 31.5 V48"
        stroke="currentColor"
        strokeWidth="2.15"
        strokeLinecap="square"
      />
      <path
        d="M33.5 31.5 V48 M33.5 39.5 H41 M41 31.5 V48"
        stroke="currentColor"
        strokeWidth="2.15"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  showWordmark = true,
  compact = false,
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'shrink-0 grid place-items-center rounded-[13px] border border-[var(--line)] bg-[var(--raised)] text-[var(--brass)]',
          compact ? 'size-9' : 'size-11'
        )}
      >
        <LogoMark className={cn(compact ? 'size-7' : 'size-8', markClassName)} />
      </div>
      {showWordmark && (
        <div className="min-w-0 leading-none">
          <p className="m-0 font-display text-[1.35rem] sm:text-[1.55rem] tracking-[0.01em] text-[var(--ivory)]">
            Hacker House
          </p>
          <p className="mt-1 m-0 flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[var(--stone)]">
            <span>Goa</span>
            <span className="inline-block h-px w-3 bg-[var(--brass)]/50" />
            <span>2026</span>
          </p>
        </div>
      )}
    </div>
  );
}
