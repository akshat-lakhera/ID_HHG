import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface Option<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  className?: string;
  size?: 'sm' | 'md';
  layoutId: string;
  'aria-label'?: string;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  size = 'md',
  layoutId,
  'aria-label': ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center rounded-xl border border-[var(--line)] bg-[var(--ink-2)] p-1',
        className
      )}
    >
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              'relative z-0 flex flex-1 items-center justify-center gap-1.5 rounded-lg font-medium transition-colors duration-200 cursor-pointer',
              size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm',
              active ? 'text-[var(--ink)]' : 'text-[var(--stone)] hover:text-[var(--ivory)]'
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-lg bg-[var(--ivory)]"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {opt.icon}
            <span className="relative whitespace-nowrap">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
