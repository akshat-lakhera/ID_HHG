import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Upload, Download, Check, AlertCircle, Users, ArrowRight } from 'lucide-react';
import type { CsvRecord, BadgeData } from '../types';

interface CsvImporterProps {
  onSelectRecord: (record: Partial<BadgeData>) => void;
  onBatchRecordsLoaded: (records: CsvRecord[]) => void;
}

export const CsvImporter: React.FC<CsvImporterProps> = ({
  onSelectRecord,
  onBatchRecordsLoaded,
}) => {
  const [records, setRecords] = useState<CsvRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadSampleCsv = () => {
    const sampleContent = `name,role,team,badgeId,photoUrl
Akshat Lakhera,Resident,Team Doom,HHG-8829-X,https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80
Rohan Sharma,Core Builder,Team Solana,HHG-4912-A,https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80
Maya Lin,UI Designer,Team ZK,HHG-3120-B,https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80
Devon Vance,AI Specialist,Team Autonomous,HHG-9081-C,https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80`;

    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HH_Goa_2026_Sample_Attendees.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (text: string): CsvRecord[] => {
    const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
    
    const nameIdx = headers.findIndex((h) => h.includes('name'));
    const roleIdx = headers.findIndex((h) => h.includes('role') || h.includes('stack') || h.includes('title'));
    const teamIdx = headers.findIndex((h) => h.includes('team') || h.includes('dept') || h.includes('group'));
    const idIdx = headers.findIndex((h) => h.includes('id') || h.includes('badge') || h.includes('pass'));
    const photoIdx = headers.findIndex((h) => h.includes('photo') || h.includes('image') || h.includes('avatar') || h.includes('url'));

    const parsed: CsvRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length === 0 || !cols[0]) continue;

      const record: CsvRecord = {
        name: nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : cols[0] || 'Attendee',
        role: roleIdx !== -1 && cols[roleIdx] ? cols[roleIdx] : 'RESIDENT',
        team: teamIdx !== -1 && cols[teamIdx] ? cols[teamIdx] : 'TEAM DOOM',
        badgeId: idIdx !== -1 && cols[idIdx] ? cols[idIdx] : `HHG-${Math.floor(1000 + Math.random() * 9000)}-X`,
        photoUrl: photoIdx !== -1 && cols[photoIdx] ? cols[photoIdx] : undefined,
      };

      parsed.push(record);
    }

    return parsed;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const content = evt.target?.result as string;
          const parsed = parseCSV(content);
          if (parsed.length === 0) {
            setError('CSV file is empty or missing headers (name, role, team, badgeId).');
            return;
          }
          setRecords(parsed);
          onBatchRecordsLoaded(parsed);
          setSelectedIndex(0);
          onSelectRecord(parsed[0]);
        } catch (err) {
          setError('Failed to parse CSV file. Ensure it is comma-separated.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white m-0 font-display">
            CSV Batch Import Engine
          </h2>
        </div>

        <button
          type="button"
          onClick={handleDownloadSampleCsv}
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Sample CSV</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv, text/csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Attendee CSV File</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {records.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-pink-400" />
              <span>Imported ({records.length} Attendees):</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">Click row to preview card</span>
          </div>

          <div className="max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/80 divide-y divide-white/5">
            {records.map((rec, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  onSelectRecord(rec);
                }}
                className={`w-full text-left p-2.5 flex items-center justify-between text-xs transition-colors ${
                  selectedIndex === idx
                    ? 'bg-cyan-500/20 text-white border-l-4 border-cyan-400 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="truncate pr-2">
                  <p className="font-semibold text-white truncate">{rec.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {rec.role} &bull; {rec.team}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] text-cyan-400">{rec.badgeId}</span>
                  {selectedIndex === idx ? (
                    <Check className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
