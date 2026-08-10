import { useRef, useState } from 'react';
import { Upload, AlertCircle, Loader2, X } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '../lib/brand';
import { cn } from '../lib/cn';

interface PhotoUploaderProps {
  onPhotoSelected: (url: string | null) => void;
  currentPhoto: string | null;
}

export function PhotoUploader({ onPhotoSelected, currentPhoto }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);

    const name = file.name.toLowerCase();
    const isHeic = name.endsWith('.heic') || name.endsWith('.heif');
    const typeOk =
      ACCEPTED_IMAGE_TYPES.includes(file.type) ||
      isHeic ||
      file.type.startsWith('image/');

    if (!typeOk) {
      setError('Please choose a JPG, PNG, WEBP, or HEIC photo.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Photo is larger than 12 MB. Please use a smaller file.');
      return;
    }
    if (file.size === 0) {
      setError('That file looks empty. Try another photo.');
      return;
    }

    setLoading(true);
    try {
      let finalFile = file;
      if (isHeic) {
        try {
          const heic2any = (await import('heic2any')).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9,
          });
          const blobResult = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          finalFile = new File([blobResult], 'photo.jpg', { type: 'image/jpeg' });
        } catch (heicErr) {
          console.warn('HEIC conversion failed, trying standard reader:', heicErr);
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onPhotoSelected(e.target.result as string);
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Could not read that file. Try a JPG or PNG.');
        setLoading(false);
      };
      reader.readAsDataURL(finalFile);
    } catch {
      setError('Error processing image. Please try a JPG or PNG file.');
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-2xl border border-dashed p-6 text-center transition-all duration-200',
          isDragging
            ? 'border-[var(--brass)] bg-[var(--brass)]/8 scale-[1.01]'
            : 'border-[var(--line-strong)] bg-[var(--ink-2)] hover:border-[var(--brass)]/60'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif,.heic,.heif"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
            e.target.value = '';
          }}
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-4 text-[var(--brass)]">
            <Loader2 className="size-7 animate-spin" />
            <p className="m-0 text-xs text-[var(--stone)]">Preparing photo…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5">
            <div className="grid size-11 place-items-center rounded-full border border-[var(--line)] text-[var(--brass)]">
              <Upload className="size-4" />
            </div>
            <div>
              <p className="m-0 text-sm font-medium text-[var(--ivory)]">
                Drop a portrait, or click to browse
              </p>
              <p className="mt-1 m-0 text-[11px] text-[var(--muted)]">
                JPG, PNG, WEBP, HEIC · up to 12 MB
              </p>
            </div>
          </div>
        )}
      </div>

      {currentPhoto && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--ink-2)] px-3 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={currentPhoto}
              alt="Uploaded portrait"
              className="size-8 rounded-full object-cover ring-1 ring-[var(--brass)]/40"
            />
            <span className="truncate text-xs text-[var(--ivory)]">Portrait ready</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPhotoSelected(null);
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--stone)] transition-colors hover:bg-white/5 hover:text-[var(--danger)]"
          >
            <X className="size-3.5" />
            Remove
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2.5 text-xs text-[var(--danger)]"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
