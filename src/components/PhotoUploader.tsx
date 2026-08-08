import React, { useState, useRef } from 'react';
import { Upload, Sparkles, AlertCircle, Loader2, X } from 'lucide-react';

interface PhotoUploaderProps {
  onPhotoSelected: (url: string | null) => void;
  currentPhoto: string | null;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotoSelected,
  currentPhoto,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);
    setLoading(true);

    try {
      let finalFile = file;

      const filename = file.name.toLowerCase();
      if (filename.endsWith('.heic') || filename.endsWith('.heif')) {
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
        setError('Failed to read image file. Please try another image.');
        setLoading(false);
      };
      reader.readAsDataURL(finalFile);
    } catch (err) {
      console.error(err);
      setError('Error processing image. Please try a JPG or PNG file.');
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
          isDragging
            ? 'border-cyan-500 bg-cyan-500/10 scale-[1.01]'
            : 'border-white/20 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif"
          onChange={handleFileChange}
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-4 text-cyan-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-xs font-medium text-slate-300">Processing photo file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                Click to upload attendee photo <span className="text-slate-400 font-normal">or drag & drop</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports JPG, PNG, WEBP & iPhone HEIC photos
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 text-slate-300 border border-white/10">
              <Sparkles className="w-3 h-3 text-lime-400" /> Instant local processing
            </span>
          </div>
        )}
      </div>

      {currentPhoto && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs">
          <div className="flex items-center gap-2.5">
            <img src={currentPhoto} alt="Loaded photo" className="w-8 h-8 rounded-full object-cover border border-cyan-400" />
            <span className="text-slate-200 font-semibold">Attendee Photo Loaded</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPhotoSelected(null);
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
            <span>Remove</span>
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
