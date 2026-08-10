import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { Download, Box, Layers2 } from 'lucide-react';
import { Header } from './components/Header';
import { PhotoUploader } from './components/PhotoUploader';
import { CanvasControls } from './components/CanvasControls';
import { CustomizerPanel } from './components/CustomizerPanel';
import { FrontCardCanvas } from './components/FrontCardCanvas';
import { BackCardCanvas } from './components/BackCardCanvas';
import { PfpFrameCanvas } from './components/PfpFrameCanvas';
import { ShareModal } from './components/ShareModal';
import { PhysicsLanyardCard } from './components/PhysicsLanyardCard';
import { R3FLanyard } from './components/R3FLanyard';
import { Panel } from './components/ui/Panel';
import { Button } from './components/ui/Button';
import { Segmented } from './components/ui/Segmented';
import { Logo } from './components/Logo';
import { XIcon } from './components/icons';
import { loadPersistedBadge, useBadgePersistence } from './hooks/useBadgePersistence';
import { sanitizeFilename } from './lib/images';
import type { BadgeData, FormatType, CardSide } from './types';

function downloadPng(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function App() {
  const persisted = useMemo(() => loadPersistedBadge(), []);
  const [format, setFormat] = useState<FormatType>('card');
  const [cardSide, setCardSide] = useState<CardSide>('front');
  const [viewMode, setViewMode] = useState<'r3f' | '2d'>('2d');
  const [badgeData, setBadgeData] = useState<BadgeData>({
    ...persisted,
    photoUrl: null,
    cardBgTheme: 'cyber',
    customBgUrl: null,
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string | null>(null);
  const [frontCanvas, setFrontCanvas] = useState<HTMLCanvasElement | null>(null);
  const [backCanvas, setBackCanvas] = useState<HTMLCanvasElement | null>(null);
  const pfpCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useBadgePersistence(badgeData);

  const updateBadgeData = useCallback((updates: Partial<BadgeData>) => {
    setBadgeData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handlePhotoSelected = useCallback((url: string | null) => {
    setBadgeData((prev) => ({ ...prev, photoUrl: url }));
  }, []);

  const handleFrontReady = useCallback((c: HTMLCanvasElement) => {
    setFrontCanvas((prev) => (prev === c ? prev : c));
  }, []);
  const handleBackReady = useCallback((c: HTMLCanvasElement) => {
    setBackCanvas((prev) => (prev === c ? prev : c));
  }, []);
  const handlePfpReady = useCallback((c: HTMLCanvasElement) => {
    pfpCanvasRef.current = c;
  }, []);

  const getActiveCanvas = useCallback((): HTMLCanvasElement | null => {
    if (format === 'pfp') return pfpCanvasRef.current;
    if (cardSide === 'back') return backCanvas;
    return frontCanvas || backCanvas || pfpCanvasRef.current;
  }, [format, cardSide, frontCanvas, backCanvas]);

  const handleDownload = () => {
    const name = sanitizeFilename(badgeData.name);

    try {
      if (format === 'pfp') {
        const canvas = pfpCanvasRef.current;
        if (!canvas) {
          toast.error('Frame is still rendering. Try again in a moment.');
          return;
        }
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        setExportedImageUrl(dataUrl);
        downloadPng(dataUrl, `HH-Goa-2026-Frame-${name}.png`);
        toast.success('Frame downloaded');
      } else {
        if (!frontCanvas && !backCanvas) {
          toast.error('Pass is still rendering. Try again in a moment.');
          return;
        }
        if (frontCanvas) {
          const frontUrl = frontCanvas.toDataURL('image/png', 1.0);
          setExportedImageUrl(frontUrl);
          downloadPng(frontUrl, `HH-Goa-2026-FRONT-${name}.png`);
        }
        if (backCanvas) {
          window.setTimeout(() => {
            const backUrl = backCanvas.toDataURL('image/png', 1.0);
            downloadPng(backUrl, `HH-Goa-2026-BACK-${name}.png`);
          }, 280);
        }
        toast.success(frontCanvas && backCanvas ? 'Front and back downloaded' : 'Pass downloaded');
      }
      setShareModalOpen(true);
    } catch {
      toast.error('Could not export the image. Please try again.');
    }
  };

  const handleShareToX = () => {
    const canvas = getActiveCanvas();
    if (canvas) {
      try {
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        setExportedImageUrl(dataUrl);
        const name = sanitizeFilename(badgeData.name);
        downloadPng(
          dataUrl,
          `HH-Goa-2026-${format === 'pfp' ? 'Frame' : cardSide.toUpperCase()}-${name}.png`
        );
        canvas.toBlob((blob) => {
          if (blob && navigator.clipboard?.write) {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).catch(() => {
              /* clipboard requires secure context / gesture */
            });
          }
        }, 'image/png');
      } catch {
        toast.error('Could not prepare the image for sharing.');
      }
    }

    const tweetText = `Just made my official Hacker House Goa 2026 ${
      format === 'pfp' ? 'frame' : 'pass'
    }.\nRole: ${badgeData.role || 'RESIDENT'}\n\nSee you at @247pmstudio\n#HackerHouseGoa #FrameInGoa #HHGoa2026`;
    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setShareModalOpen(true);
  };

  const handleFormat = (next: FormatType) => {
    setFormat(next);
    if (next === 'both' || next === 'pfp') setViewMode('2d');
  };

  const downloadLabel =
    format === 'pfp' ? 'Download frame' : format === 'both' ? 'Download both sides' : 'Download pass';

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-28 text-[var(--ivory)] sm:pb-16">
      <div className="ambient" />
      <div className="grain" />

      <div
        className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
        aria-hidden
        data-export-front={frontCanvas ? 'ready' : 'pending'}
        data-export-back={backCanvas ? 'ready' : 'pending'}
      >
        <FrontCardCanvas badgeData={badgeData} onCanvasReady={handleFrontReady} />
        <BackCardCanvas onCanvasReady={handleBackReady} />
        <PfpFrameCanvas badgeData={badgeData} onCanvasReady={handlePfpReady} />
      </div>

      <Header format={format} setFormat={handleFormat} />

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <p className="m-0 text-[11px] uppercase tracking-[0.32em] text-[var(--brass)]">
            Official studio
          </p>
          <h2 className="mt-2 mb-3 font-display text-[2.15rem] leading-[1.05] font-semibold tracking-tight text-[var(--ivory)] sm:text-5xl">
            Craft your builder pass.
          </h2>
          <p className="m-0 text-sm leading-relaxed text-[var(--stone)] sm:text-base">
            A quiet studio for the Hacker House Goa residency. Portrait, details, download.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="order-2 space-y-4 lg:order-1 lg:col-span-5">
            <Panel eyebrow="01" title="Portrait">
              <PhotoUploader onPhotoSelected={handlePhotoSelected} currentPhoto={badgeData.photoUrl} />
            </Panel>
            <CanvasControls badgeData={badgeData} updateBadgeData={updateBadgeData} />
            <CustomizerPanel
              badgeData={badgeData}
              updateBadgeData={updateBadgeData}
              format={format}
            />
          </div>

          <div className="order-1 lg:sticky lg:top-24 lg:order-2 lg:col-span-7">
            <div className="panel overflow-hidden rounded-2xl p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-3 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="m-0 text-[10px] uppercase tracking-[0.22em] text-[var(--brass)]">
                    Preview
                  </p>
                  <p className="mt-1 mb-0 text-sm text-[var(--stone)]">
                    {format === 'both'
                      ? 'Front and back'
                      : viewMode === 'r3f'
                        ? 'Drag the lanyard'
                        : format === 'pfp'
                          ? 'Profile frame'
                          : cardSide === 'back'
                            ? 'Reverse'
                            : 'Obverse'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {format === 'card' && (
                    <Segmented
                      aria-label="View mode"
                      layoutId="view-pill"
                      size="sm"
                      value={viewMode}
                      onChange={setViewMode}
                      options={[
                        { id: '2d', label: 'Flat', icon: <Layers2 className="size-3.5" /> },
                        { id: 'r3f', label: 'Lanyard', icon: <Box className="size-3.5" /> },
                      ]}
                    />
                  )}
                  {viewMode === '2d' && format === 'card' && (
                    <Segmented
                      aria-label="Card side"
                      layoutId="side-pill"
                      size="sm"
                      value={cardSide === 'both' ? 'front' : cardSide}
                      onChange={(side) => setCardSide(side)}
                      options={[
                        { id: 'front', label: 'Front' },
                        { id: 'back', label: 'Back' },
                      ]}
                    />
                  )}
                </div>
              </div>

              <div className="flex min-h-[400px] flex-col items-center justify-center sm:min-h-[460px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${format}-${viewMode}-${cardSide}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    {format === 'both' ? (
                      <div className="flex w-full flex-col items-center justify-center gap-6 py-1 md:flex-row">
                        <div className="flex flex-col items-center">
                          <span className="mb-1 text-[10px] uppercase tracking-[0.22em] text-[var(--brass)]">
                            Front
                          </span>
                          <PhysicsLanyardCard>
                            <FrontCardCanvas badgeData={badgeData} />
                          </PhysicsLanyardCard>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="mb-1 text-[10px] uppercase tracking-[0.22em] text-[var(--stone)]">
                            Back
                          </span>
                          <PhysicsLanyardCard>
                            <BackCardCanvas />
                          </PhysicsLanyardCard>
                        </div>
                      </div>
                    ) : viewMode === '2d' ? (
                      <>
                        {format === 'card' && cardSide === 'front' && (
                          <PhysicsLanyardCard>
                            <FrontCardCanvas badgeData={badgeData} />
                          </PhysicsLanyardCard>
                        )}
                        {format === 'card' && cardSide === 'back' && (
                          <PhysicsLanyardCard>
                            <BackCardCanvas />
                          </PhysicsLanyardCard>
                        )}
                        {format === 'pfp' && (
                          <PhysicsLanyardCard>
                            <PfpFrameCanvas badgeData={badgeData} />
                          </PhysicsLanyardCard>
                        )}
                      </>
                    ) : (
                      <R3FLanyard
                        badgeData={badgeData}
                        frontCanvas={frontCanvas}
                        backCanvas={backCanvas}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-5 hidden gap-3 border-t border-[var(--line)] pt-4 lg:grid lg:grid-cols-2">
                <Button onClick={handleDownload} className="py-3">
                  <Download className="size-4" />
                  {downloadLabel}
                </Button>
                <Button variant="secondary" onClick={handleShareToX} className="py-3">
                  <XIcon className="size-4" />
                  Share on X
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 mx-auto mt-12 flex w-full max-w-7xl items-center justify-between px-4 pb-6 text-[11px] tracking-wide text-[var(--muted)] sm:px-6">
        <Logo compact showWordmark={false} />
        <p className="m-0">Hacker House Goa · 2026</p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_88%,transparent)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleDownload} className="py-3 text-xs">
            <Download className="size-4" />
            Download
          </Button>
          <Button variant="secondary" onClick={handleShareToX} className="py-3 text-xs">
            <XIcon className="size-4" />
            Share
          </Button>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        imageUrl={exportedImageUrl}
        badgeName={badgeData.name}
        badgeTitle={badgeData.role}
        formatType={format}
      />

      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: '#1A1713',
            border: '1px solid rgba(196,164,106,0.22)',
            color: '#F3EDE3',
            fontFamily: 'Manrope, sans-serif',
          },
        }}
      />
    </div>
  );
}

export default App;
