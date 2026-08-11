import type { ReactNode } from 'react';
import { ZoomIn, ArrowLeftRight, ArrowUpDown, RotateCw, RefreshCw } from 'lucide-react';
import type { BadgeData } from '../types';
import { Panel } from './ui/Panel';
import { cn } from '../lib/cn';

interface CanvasControlsProps {
  badgeData: BadgeData;
  updateBadgeData: (updates: Partial<BadgeData>) => void;
}

const FILTERS: { id: BadgeData['filter']; label: string }[] = [
  { id: 'none', label: 'Natural' },
  { id: 'vivid', label: 'Warm' },
  { id: 'cyber', label: 'Cool' },
  { id: 'vintage', label: 'Film' },
  { id: 'bw', label: 'Mono' },
];

export function CanvasControls({ badgeData, updateBadgeData }: CanvasControlsProps) {
  const handleReset = () => {
    updateBadgeData({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      filter: 'none',
    });
  };

  return (
    <Panel
      eyebrow="02"
      title="Crop & grade"
      action={
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--stone)] transition-colors hover:bg-white/5 hover:text-[var(--ivory)]"
        >
          <RefreshCw className="size-3.5" />
          Reset
        </button>
      }
    >
      <div className="space-y-4">
        <SliderRow
          icon={<ZoomIn className="size-3.5" />}
          label="Zoom (Scale)"
          value={`${Math.round(badgeData.scale * 100)}%`}
        >
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={badgeData.scale}
            aria-label="Photo zoom scale"
            onChange={(e) => updateBadgeData({ scale: parseFloat(e.target.value) })}
            className="w-full"
          />
        </SliderRow>

        <div className="grid grid-cols-2 gap-3">
          <SliderRow
            icon={<ArrowLeftRight className="size-3.5 text-[var(--brass)]" />}
            label="Pan X (Left / Right)"
            value={`${badgeData.offsetX > 0 ? `+${badgeData.offsetX}` : badgeData.offsetX}px`}
          >
            <input
              type="range"
              min="-250"
              max="250"
              step="1"
              value={badgeData.offsetX}
              aria-label="Horizontal position X"
              onChange={(e) => updateBadgeData({ offsetX: parseInt(e.target.value, 10) })}
              className="w-full"
            />
          </SliderRow>

          <SliderRow
            icon={<ArrowUpDown className="size-3.5 text-[var(--brass)]" />}
            label="Pan Y (Up / Down)"
            value={`${badgeData.offsetY > 0 ? `+${badgeData.offsetY}` : badgeData.offsetY}px`}
          >
            <input
              type="range"
              min="-250"
              max="250"
              step="1"
              value={badgeData.offsetY}
              aria-label="Vertical position Y"
              onChange={(e) => updateBadgeData({ offsetY: parseInt(e.target.value, 10) })}
              className="w-full"
            />
          </SliderRow>
        </div>

        <SliderRow
          icon={<RotateCw className="size-3.5" />}
          label="Rotate angle"
          value={`${badgeData.rotation}°`}
        >
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={badgeData.rotation}
            aria-label="Rotation angle"
            onChange={(e) => updateBadgeData({ rotation: parseInt(e.target.value, 10) })}
            className="w-full"
          />
        </SliderRow>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--stone)]">
            Color Grade Filter
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateBadgeData({ filter: f.id })}
                className={cn(
                  'rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors',
                  badgeData.filter === f.id
                    ? 'bg-[var(--ivory)] text-[var(--ink)]'
                    : 'bg-[var(--ink-2)] text-[var(--stone)] hover:text-[var(--ivory)]'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function SliderRow({
  icon,
  label,
  value,
  children,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-[var(--stone)]">
        <span className="inline-flex items-center gap-1.5 font-medium">
          {icon}
          {label}
        </span>
        <span className="font-mono text-[var(--brass)]">{value}</span>
      </div>
      {children}
    </div>
  );
}
