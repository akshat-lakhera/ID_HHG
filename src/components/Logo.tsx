import { cn } from '../lib/cn';
import hhgLogo from '../assets/hhg_logo.png';

interface LogoProps {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  compact?: boolean;
}

/** Official Hacker House Goa Emblem */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={hhgLogo}
      alt="Hacker House Goa Logo"
      className={cn('object-cover rounded-lg shadow-md border border-emerald-500/30', className)}
    />
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
          'shrink-0 grid place-items-center overflow-hidden rounded-[13px] border border-emerald-400/50 bg-[#1B7340] text-[var(--brass)] shadow-lg shadow-emerald-950/50',
          compact ? 'size-9 p-0.5' : 'size-11 p-1'
        )}
      >
        <LogoMark className={cn(compact ? 'size-8' : 'size-9', markClassName)} />
      </div>
      {showWordmark && (
        <div className="min-w-0 leading-none">
          <div className="flex items-center gap-1.5">
            <p className="m-0 font-display text-[1.35rem] sm:text-[1.55rem] tracking-[0.01em] text-[var(--ivory)] font-bold">
              Hacker House
            </p>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E6007A] text-yellow-300 border border-yellow-300/40 shadow-sm font-sans">
              गोवा
            </span>
          </div>
          <p className="mt-1 m-0 flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[var(--stone)] font-mono">
            <span>Goa</span>
            <span className="inline-block h-px w-3 bg-[var(--brass)]/50" />
            <span>2026</span>
          </p>
        </div>
      )}
    </div>
  );
}
