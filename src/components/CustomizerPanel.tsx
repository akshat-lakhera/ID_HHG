import { useRef } from 'react';
import { User, Code2, Users, CreditCard, Upload, RotateCcw, Sparkles, Dices } from 'lucide-react';
import type { BadgeData, FormatType } from '../types';
import { FIELD_LIMITS } from '../lib/brand';
import { getRandomTitle } from '../data/builderTitles';
import { Panel } from './ui/Panel';
import { Field } from './ui/Field';
import { cn } from '../lib/cn';

interface CustomizerPanelProps {
  badgeData: BadgeData;
  updateBadgeData: (updates: Partial<BadgeData>) => void;
  format: FormatType;
}

export function CustomizerPanel({
  badgeData,
  updateBadgeData,
  format,
}: CustomizerPanelProps) {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const showPassFields = format === 'card' || format === 'both';

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.name.toLowerCase().match(/\.(heic|heif)$/)) {
      return;
    }
    if (file.size > 12 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        updateBadgeData({ customBgUrl: evt.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRollTitle = () => {
    const title = getRandomTitle();
    updateBadgeData({ builderTitle: title });
  };

  return (
    <Panel eyebrow="03" title="Details">
      <div className="space-y-4">
        {showPassFields && (
          <Field
            label="Name"
            icon={<User className="size-3.5 text-[var(--brass)]" />}
            value={badgeData.name}
            maxLength={FIELD_LIMITS.name}
            placeholder="Your name"
            autoComplete="name"
            onChange={(e) => updateBadgeData({ name: e.target.value })}
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Role / Stack"
            icon={<Code2 className="size-3.5 text-[var(--brass)]" />}
            value={badgeData.role}
            maxLength={FIELD_LIMITS.role}
            placeholder="Resident / Fullstack"
            onChange={(e) => updateBadgeData({ role: e.target.value })}
          />
          <Field
            label="Team"
            icon={<Users className="size-3.5 text-[var(--brass)]" />}
            value={badgeData.team}
            maxLength={FIELD_LIMITS.team}
            placeholder="Team"
            onChange={(e) => updateBadgeData({ team: e.target.value })}
          />
        </div>

        {showPassFields && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--stone)] flex items-center gap-1.5">
                <Sparkles className="size-3 text-[var(--brass)]" />
                Generated Builder Title
              </label>
              <button
                type="button"
                onClick={handleRollTitle}
                className="flex items-center gap-1 rounded-md bg-[var(--brass)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--brass-soft)] hover:bg-[var(--brass)]/20 transition-colors"
              >
                <Dices className="size-3" />
                Roll Random
              </button>
            </div>
            <input
              type="text"
              value={badgeData.builderTitle || 'Cyber Palms Architect'}
              onChange={(e) => updateBadgeData({ builderTitle: e.target.value })}
              placeholder="e.g. Solana Wave Rider"
              maxLength={32}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--ink-2)] px-3 py-2.5 text-xs text-[var(--ivory)] placeholder:text-[var(--stone)]/60 focus:border-[var(--brass)] focus:outline-none"
            />
          </div>
        )}

        {showPassFields && (
          <Field
            label="Pass ID"
            icon={<CreditCard className="size-3.5 text-[var(--brass)]" />}
            value={badgeData.badgeId}
            maxLength={FIELD_LIMITS.badgeId}
            placeholder="HHG-0000-X"
            className="font-mono uppercase tracking-wide text-[var(--brass-soft)]"
            onChange={(e) => updateBadgeData({ badgeId: e.target.value.toUpperCase() })}
          />
        )}

        {showPassFields && (
          <div className="space-y-2 border-t border-[var(--line)] pt-4">
            <p className="m-0 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--stone)]">
              Card background
            </p>
            <input
              ref={bgInputRef}
              type="file"
              accept="image/*"
              onChange={handleCustomBgUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => bgInputRef.current?.click()}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-3 text-xs font-medium transition-colors',
                badgeData.customBgUrl
                  ? 'border-[var(--brass)]/50 bg-[var(--brass)]/8 text-[var(--brass-soft)]'
                  : 'border-[var(--line-strong)] bg-[var(--ink-2)] text-[var(--stone)] hover:border-[var(--brass)] hover:text-[var(--ivory)]'
              )}
            >
              <Upload className="size-3.5" />
              {badgeData.customBgUrl ? 'Change background' : 'Upload background'}
            </button>
            {badgeData.customBgUrl && (
              <button
                type="button"
                onClick={() => updateBadgeData({ customBgUrl: null })}
                className="flex w-full items-center justify-center gap-1.5 py-1.5 text-xs text-[var(--stone)] transition-colors hover:text-[var(--danger)]"
              >
                <RotateCcw className="size-3.5" />
                Restore default
              </button>
            )}
          </div>
        )}
      </div>
    </Panel>
  );
}
