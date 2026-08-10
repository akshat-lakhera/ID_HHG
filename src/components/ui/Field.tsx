import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  hint?: string;
}

export function Field({
  label,
  icon,
  hint,
  className,
  maxLength,
  value,
  id,
  ...props
}: FieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  const length = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--stone)]"
      >
        {icon}
        {label}
      </label>
      <input
        id={fieldId}
        value={value}
        maxLength={maxLength}
        className={cn('field', className)}
        {...props}
        onChange={(e) => {
          if (typeof maxLength === 'number' && e.target.value.length > maxLength) {
            e.target.value = e.target.value.slice(0, maxLength);
          }
          props.onChange?.(e);
        }}
      />
      <div className="flex items-center justify-between text-[10px] text-[var(--muted)]">
        <span>{hint}</span>
        {typeof maxLength === 'number' && (
          <span className="font-mono">
            {length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
