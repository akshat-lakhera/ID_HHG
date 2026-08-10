import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
}

export function Panel({
  title,
  eyebrow,
  action,
  className,
  children,
  ...props
}: PanelProps) {
  return (
    <section
      className={cn('panel rounded-2xl p-5', className)}
      {...props}
    >
      {(title || action || eyebrow) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <p className="m-0 mb-1 text-[10px] uppercase tracking-[0.24em] text-[var(--brass)]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="m-0 font-display text-xl font-semibold text-[var(--ivory)]">
                {title}
              </h2>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
