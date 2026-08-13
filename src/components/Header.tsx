import { BadgeCheck, Image as ImageIcon, Layers, MapPin, Calendar } from 'lucide-react';
import type { FormatType } from '../types';
import { Logo } from './Logo';
import { Segmented } from './ui/Segmented';

interface HeaderProps {
  format: FormatType;
  setFormat: (format: FormatType) => void;
}

export function Header({ format, setFormat }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_82%,transparent)] backdrop-blur-2xl shadow-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Logo compact />
          <div className="hidden items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-[var(--stone)] sm:flex font-mono">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3 text-[var(--brass)]" />
              Anjuna, Goa
            </span>
            <span className="h-3 w-px bg-[var(--line-strong)]" />
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3 text-[var(--brass)]" />
              28 - 31 Oct 2026
            </span>
          </div>
        </div>

        <Segmented
          aria-label="Output format"
          layoutId="format-pill"
          value={format}
          onChange={setFormat}
          className="w-full lg:w-auto"
          options={[
            { id: 'card', label: 'Pass', icon: <BadgeCheck className="size-3.5" /> },
            { id: 'pfp', label: 'Frame', icon: <ImageIcon className="size-3.5" /> },
            { id: 'both', label: 'Dual', icon: <Layers className="size-3.5" /> },
          ]}
        />
      </div>
    </header>
  );
}
