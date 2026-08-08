import React from 'react';
import { BadgeCheck, Image as ImageIcon, Layers, MapPin, Calendar } from 'lucide-react';
import type { FormatType } from '../types';

interface HeaderProps {
  format: FormatType;
  setFormat: (format: FormatType) => void;
}

export const Header: React.FC<HeaderProps> = ({ format, setFormat }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-lime-400 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400 text-lg">
                HH
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-white m-0 leading-none">
                HH GOA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-lime-400">2026</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Builder Pass
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Goa, India
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-lime-400" /> Aug 13th, 2026
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-white/10 text-sm font-medium w-full md:w-auto justify-center">
          <button
            onClick={() => setFormat('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              format === 'card'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            <span>Format B: Builder ID</span>
          </button>

          <button
            onClick={() => setFormat('pfp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              format === 'pfp'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-emerald-500/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Format A: PFP Frame</span>
          </button>

          <button
            onClick={() => setFormat('both')}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              format === 'both'
                ? 'bg-gradient-to-r from-lime-500 to-emerald-600 text-black font-bold shadow-md shadow-lime-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dual View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
