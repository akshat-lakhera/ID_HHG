import React, { useRef } from 'react';
import { User, Code2, Users, CreditCard, Sparkles, Upload, RotateCcw } from 'lucide-react';
import type { BadgeData } from '../types';

interface CustomizerPanelProps {
  badgeData: BadgeData;
  updateBadgeData: (updates: Partial<BadgeData>) => void;
}

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({
  badgeData,
  updateBadgeData,
}) => {
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          updateBadgeData({ customBgUrl: evt.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Sparkles className="w-5 h-5 text-pink-400" />
        <h2 className="text-lg font-bold text-white m-0 font-display">
          Attendee & Background Details
        </h2>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <User className="w-4 h-4 text-cyan-400" /> Cardholder Name
        </label>
        <input
          type="text"
          value={badgeData.name}
          onChange={(e) => updateBadgeData({ name: e.target.value })}
          placeholder="e.g. AKSHAT LAKHERA"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-semibold uppercase"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-emerald-400" /> Role Tag
          </label>
          <input
            type="text"
            value={badgeData.role}
            onChange={(e) => updateBadgeData({ role: e.target.value })}
            placeholder="e.g. RESIDENT"
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium uppercase"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-400" /> Team Tag
          </label>
          <input
            type="text"
            value={badgeData.team}
            onChange={(e) => updateBadgeData({ team: e.target.value })}
            placeholder="e.g. TEAM DOOM"
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium uppercase"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-pink-400" /> Pass Identifier Code
        </label>
        <input
          type="text"
          value={badgeData.badgeId}
          onChange={(e) => updateBadgeData({ badgeId: e.target.value })}
          placeholder="e.g. HHG-8829-X"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-cyan-300 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-bold uppercase"
        />
      </div>

      {/* CUSTOM BACKGROUND WALLPAPER UPLOADER ONLY */}
      <div className="space-y-2 pt-3 border-t border-white/10">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-cyan-400" /> Card Background Image
        </label>
        <div>
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
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed text-xs font-semibold transition-all ${
              badgeData.customBgUrl
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-900/80 border-white/20 text-slate-200 hover:text-white hover:border-cyan-400 hover:bg-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>
              {badgeData.customBgUrl ? 'Custom Background Loaded (Click to Change)' : 'Upload Custom Card Background Image'}
            </span>
          </button>
        </div>

        {badgeData.customBgUrl && (
          <button
            type="button"
            onClick={() => updateBadgeData({ customBgUrl: null })}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Background</span>
          </button>
        )}
      </div>
    </div>
  );
};
