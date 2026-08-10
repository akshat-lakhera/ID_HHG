import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--ivory)] text-[var(--ink)] hover:bg-[var(--brass-soft)] shadow-[0_10px_28px_-16px_rgba(243,237,227,0.55)]',
  secondary:
    'bg-transparent text-[var(--ivory)] border border-[var(--line-strong)] hover:border-[var(--brass)] hover:bg-[var(--raised)]',
  ghost:
    'bg-transparent text-[var(--stone)] hover:text-[var(--ivory)] hover:bg-white/5',
  danger: 'bg-transparent text-[var(--danger)] hover:bg-[var(--danger)]/10',
};

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 ease-[var(--ease)] cursor-pointer',
        'active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brass)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
