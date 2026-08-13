import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Copy, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { XIcon } from './icons';
import { Button } from './ui/Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  badgeName: string;
  badgeTitle: string;
  formatType: string;
}

export function ShareModal({
  isOpen,
  onClose,
  imageUrl,
  badgeName,
  badgeTitle,
  formatType,
}: ShareModalProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopiedText(false);
      setCopiedImage(false);
    }
  }, [isOpen]);

  const kind = formatType === 'pfp' ? 'frame' : 'pass';
  const tweetText = `Just made my official Hacker House Goa 2026 ${kind}.\n${badgeName ? `${badgeName} · ` : ''}${badgeTitle || 'Resident'}\n\nSee you at @247pmstudio\n#HackerHouseGoa #FrameInGoa #HHGoa2026`;
  const xIntentUrl = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`;

  const handleNativeShare = async () => {
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `HH-Goa-2026-${formatType}.png`, { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Hacker House Goa 2026',
            text: tweetText,
          });
          return;
        }
      } catch (err) {
        console.warn('Native share fallback to x.com intent:', err);
      }
    }
    await handleCopyImageToClipboard();
    window.open(xIntentUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(tweetText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      setCopiedText(false);
    }
  };

  const handleCopyImageToClipboard = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
    } catch (err) {
      console.warn('Clipboard image copy not supported:', err);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--ink)]/80 backdrop-blur-md data-[state=open]:animate-[fadeIn_200ms_ease]" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-50 w-[min(100%-1.5rem,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--line)] bg-[#0e3d22]/95 p-6 shadow-2xl focus:outline-none"
          onOpenAutoFocus={(e: Event) => e.preventDefault()}
        >
          <Dialog.Title className="m-0 font-display text-2xl text-[var(--ivory)] font-bold">
            Your {kind} is ready
          </Dialog.Title>
          <Dialog.Description className="mt-1 mb-5 text-sm text-[var(--stone)] font-sans">
            Share with @247pmstudio · #HackerHouseGoa
          </Dialog.Description>

          {imageUrl && (
            <div className="mb-5 flex justify-center">
              <img
                src={imageUrl}
                alt="Generated pass preview"
                className="max-h-56 rounded-xl border border-[var(--line)] object-contain shadow-xl"
              />
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleNativeShare} className="w-full py-3">
              <XIcon className="size-4" />
              Open X
              <ExternalLink className="size-3.5 opacity-60" />
            </Button>

            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="secondary" onClick={handleCopyImageToClipboard} disabled={!imageUrl}>
                {copiedImage ? (
                  <>
                    <Check className="size-4 text-[var(--success)]" />
                    Copied
                  </>
                ) : (
                  <>
                    <ImageIcon className="size-4" />
                    Copy image
                  </>
                )}
              </Button>

              <Button variant="secondary" onClick={handleCopyCaption}>
                {copiedText ? (
                  <>
                    <Check className="size-4 text-[var(--success)]" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Copy caption
                  </>
                )}
              </Button>
            </div>
          </div>

          <p className="mt-4 mb-0 text-[11px] leading-relaxed text-[var(--muted)] font-sans">
            On X, click the composer and paste with{' '}
            <kbd className="rounded border border-[var(--line)] bg-[var(--ink)] px-1.5 py-0.5 font-mono text-[var(--ivory)]">
              ⌘/Ctrl + V
            </kbd>{' '}
            or attach the downloaded PNG.
          </p>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-[var(--stone)] transition-colors hover:bg-white/5 hover:text-[var(--ivory)] cursor-pointer"
            >
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
