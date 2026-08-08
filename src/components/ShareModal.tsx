import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Sparkles, ExternalLink, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { XIcon } from './icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  badgeName: string;
  badgeTitle: string;
  formatType: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  badgeTitle,
  formatType,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#06b6d4', '#f59e0b', '#8b5cf6'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Exact handles and hashtags specified by user
  const tweetText = `Just created my official Hacker House Goa 2026 ${
    formatType === 'pfp' ? 'PFP Frame' : 'Pass'
  }! 🌴⚡\nRole: ${badgeTitle || 'RESIDENT'}\n\nSee you at @247pmstudio! 🚀 #HackerHouseGoa #FrameInGoa #HHGoa2026`;

  const xIntentUrl = `https://x.com/intent/post?text=${encodeURIComponent(
    tweetText
  )}`;

  const handleNativeShare = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `HH-Goa-2026-${formatType}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Hacker House Goa 2026 ID Pass',
          text: tweetText,
        });
        return;
      }
    } catch (err) {
      console.warn('Native share fallback to x.com intent:', err);
    }

    handleCopyImageToClipboard();
    window.open(xIntentUrl, '_blank');
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(tweetText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  const handleCopyImageToClipboard = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 3000);
    } catch (err) {
      console.warn('Clipboard image copy not supported in browser:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> High-Resolution Image Ready!
          </div>
          <h3 className="text-2xl font-extrabold text-white font-display m-0">
            Share Your Pass on X (Twitter) 🌴
          </h3>
          <p className="text-sm text-slate-400">
            Tagging <span className="text-cyan-400 font-semibold">@247pmstudio</span> & <span className="text-lime-400 font-semibold">#HackerHouseGoa #FrameInGoa #HHGoa2026</span>
          </p>
        </div>

        {imageUrl && (
          <div className="flex justify-center py-2">
            <img
              src={imageUrl}
              alt="Generated Badge"
              className="max-h-64 rounded-2xl shadow-xl border border-white/20 object-contain"
            />
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-base cursor-pointer"
          >
            <XIcon className="w-5 h-5 fill-current" />
            <span>Open X.com & Tag @247pmstudio</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyImageToClipboard}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 border border-white/15 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              {copiedImage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Image Copied!</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Copy Image (Ctrl+V)</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyCaption}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 border border-white/15 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Text Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Tweet Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-xs text-slate-300 space-y-1.5">
          <p className="font-bold text-cyan-400 flex items-center gap-1.5">
            💡 How to Attach Image on X:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>When X opens, click the tweet box.</li>
            <li>Press <span className="text-white font-mono font-bold bg-white/10 px-1 py-0.5 rounded">Ctrl + V</span> to paste the copied card image directly!</li>
            <li>Or click the 📷 image icon on X and select the downloaded PNG file.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
