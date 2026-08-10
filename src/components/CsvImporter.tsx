import { useRef, useState } from 'react';
import { Upload, Download, Check, AlertCircle, Users, ArrowRight } from 'lucide-react';
import type { CsvRecord, BadgeData } from '../types';
import { Panel } from './ui/Panel';
import { cn } from '../lib/cn';

interface CsvImporterProps {
  onSelectRecord: (record: Partial<BadgeData>) => void;
  onBatchRecordsLoaded: (records: CsvRecord[]) => void;
}

export function CsvImporter({ onSelectRecord, onBatchRecordsLoaded }: CsvImporterProps) {
  const [records, setRecords] = useState<CsvRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadSampleCsv = () => {
    const sampleContent = `name,role,team,badgeId,photoUrl
Akshat Lakhera,Resident,Team Doom,HHG-8829-X,
Rohan Sharma,Core Builder,Team Solana,HHG-4912-A,
Maya Lin,UI Designer,Team ZK,HHG-3120-B,
Devon Vance,AI Specialist,Team Autonomous,HHG-9081-C,`;

    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HH_Goa_2026_Sample_Attendees.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): CsvRecord[] => {
    const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
    const nameIdx = headers.findIndex((h) => h.includes('name'));
    const roleIdx = headers.findIndex((h) => h.includes('role') || h.includes('stack') || h.includes('title'));
    const teamIdx = headers.findIndex((h) => h.includes('team') || h.includes('dept') || h.includes('group'));
    const idIdx = headers.findIndex((h) => h.includes('id') || h.includes('badge') || h.includes('pass'));
    const photoIdx = headers.findIndex((h) =>
      h.includes('photo') || h.includes('image') || h.includes('avatar') || h.includes('url')
    );

    const parsed: CsvRecord[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length === 0 || !cols[0]) continue;
      parsed.push({
        name: nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : cols[0] || 'Attendee',
        role: roleIdx !== -1 && cols[roleIdx] ? cols[roleIdx] : 'RESIDENT',
        team: teamIdx !== -1 && cols[teamIdx] ? cols[teamIdx] : 'TEAM DOOM',
        badgeId: idIdx !== -1 && cols[idIdx] ? cols[idIdx] : `HHG-${Math.floor(1000 + Math.random() * 9000)}-X`,
        photoUrl: photoIdx !== -1 && cols[photoIdx] ? cols[photoIdx] : undefined,
      });
    }
    return parsed;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('CSV is larger than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setError('Could not read that file.');
    reader.onload = (evt) => {
      try {
        const parsed = parseCSV((evt.target?.result as string) || '');
        if (parsed.length === 0) {
          setError('CSV is empty or missing a name column.');
          return;
        }
        setRecords(parsed);
        onBatchRecordsLoaded(parsed);
        setSelectedIndex(0);
        onSelectRecord(parsed[0]);
      } catch {
        setError('Could not parse CSV. Use comma-separated columns.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Panel
      eyebrow="04"
      title="Batch import"
      action={
        <button
          type="button"
          onClick={handleDownloadSampleCsv}
          className="inline-flex items-center gap-1 text-xs text-[var(--brass)] hover:text-[var(--brass-soft)]"
        >
          <Download className="size-3.5" />
          Sample
        </button>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--ink-2)] px-4 py-3 text-sm font-medium text-[var(--ivory)] transition-colors hover:border-[var(--brass)]"
      >
        <Upload className="size-4" />
        Upload CSV
      </button>

      {error && (
        <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2 text-xs text-[var(--danger)]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      {records.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="m-0 flex items-center gap-1.5 text-xs text-[var(--stone)]">
            <Users className="size-3.5" />
            {records.length} attendees
          </p>
          <div className="max-h-52 divide-y divide-[var(--line)] overflow-y-auto rounded-xl border border-[var(--line)]">
            {records.map((rec, idx) => (
              <button
                key={`${rec.badgeId}-${idx}`}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  onSelectRecord(rec);
                }}
                className={cn(
                  'flex w-full items-center justify-between p-2.5 text-left text-xs transition-colors',
                  selectedIndex === idx
                    ? 'bg-[var(--ivory)]/8 text-[var(--ivory)]'
                    : 'text-[var(--stone)] hover:bg-white/4 hover:text-[var(--ivory)]'
                )}
              >
                <div className="min-w-0 pr-2">
                  <p className="m-0 truncate font-medium text-[var(--ivory)]">{rec.name}</p>
                  <p className="m-0 truncate text-[10px] text-[var(--muted)]">
                    {rec.role} · {rec.team}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-mono text-[10px] text-[var(--brass)]">{rec.badgeId}</span>
                  {selectedIndex === idx ? (
                    <Check className="size-4 text-[var(--brass)]" />
                  ) : (
                    <ArrowRight className="size-3.5 text-[var(--muted)]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
