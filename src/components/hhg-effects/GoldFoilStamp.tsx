import { Award } from 'lucide-react';

export function GoldFoilStamp() {
  return (
    <div className="relative group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brass)]/40 bg-[#0e3d22]/90 backdrop-blur-md shadow-lg shadow-emerald-950/60 text-xs font-mono text-[var(--brass-soft)]">
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#C4A46A] via-[#FFF3D6] to-[#C4A46A] flex items-center justify-center text-[#092614] shadow-md shrink-0">
        <Award className="w-3.5 h-3.5 font-bold" />
      </div>
      <span className="font-bold tracking-wider text-[10px] uppercase text-[var(--ivory)]">
        VERIFIED RESIDENT · ANJUNA 2026
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
    </div>
  );
}
