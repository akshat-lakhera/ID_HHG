import React from 'react';
import { ZoomIn, Move, RotateCw, Sliders, RefreshCw } from 'lucide-react';
import type { BadgeData } from '../types';

interface CanvasControlsProps {
  badgeData: BadgeData;
  updateBadgeData: (updates: Partial<BadgeData>) => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  badgeData,
  updateBadgeData,
}) => {
  const handleReset = () => {
    updateBadgeData({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      filter: 'none',
    });
  };

  const filters: { id: BadgeData['filter']; label: string }[] = [
    { id: 'none', label: 'Original' },
    { id: 'vivid', label: 'Vivid Sunset' },
    { id: 'cyber', label: 'Cyberpunk' },
    { id: 'vintage', label: 'Goa Vintage' },
    { id: 'bw', label: 'B&W Contrast' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Photo Crop & Position</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5 text-cyan-400" /> Zoom Scale</span>
          <span className="font-mono text-cyan-400 font-semibold">{Math.round(badgeData.scale * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.05"
          value={badgeData.scale}
          onChange={(e) => updateBadgeData({ scale: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1"><Move className="w-3.5 h-3.5 text-cyan-400" /> X Offset</span>
            <span className="font-mono text-cyan-400">{badgeData.offsetX}px</span>
          </div>
          <input
            type="range"
            min="-250"
            max="250"
            step="1"
            value={badgeData.offsetX}
            onChange={(e) => updateBadgeData({ offsetX: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1"><Move className="w-3.5 h-3.5 text-cyan-400" /> Y Offset</span>
            <span className="font-mono text-cyan-400">{badgeData.offsetY}px</span>
          </div>
          <input
            type="range"
            min="-250"
            max="250"
            step="1"
            value={badgeData.offsetY}
            onChange={(e) => updateBadgeData({ offsetY: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1"><RotateCw className="w-3.5 h-3.5 text-lime-400" /> Rotate</span>
          <span className="font-mono text-lime-400">{badgeData.rotation}°</span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          step="5"
          value={badgeData.rotation}
          onChange={(e) => updateBadgeData({ rotation: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-500"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-2">
          Color Grading Filter:
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => updateBadgeData({ filter: f.id })}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all text-center truncate ${
                badgeData.filter === f.id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
