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
import { TropicalPalmParticles } from './components/hhg-effects/TropicalPalmParticles';
import { ShinyGoldText } from './components/hhg-effects/ShinyGoldText';
import { GoldFoilStamp } from './components/hhg-effects/GoldFoilStamp';
import { soundHaptics } from './lib/soundHaptics';
import { logger } from './lib/contracts';

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
    builderTitle: persisted.builderTitle || 'CYBER PALMS ARCHITECT',
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
    soundHaptics.playClick();
    logger.log('info', 'App', 'PhotoSelected', { hasPhoto: !!url });
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

  const handleDownload = () => {
    soundHaptics.playSuccess();
    const name = sanitizeFilename(badgeData.name);
    logger.log('info', 'App', 'DownloadTriggered', { format, name });

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
          }, 250);
        }
        toast.success(frontCanvas && backCanvas ? 'Front and back passes downloaded' : 'Pass downloaded');
      }
      setShareModalOpen(true);
    } catch (err) {
      logger.log('error', 'App', 'DownloadFailed', { error: String(err) });
      toast.error('Could not export the image. Please try again.');
    }
  };

  const handleShareToX = () => {
    soundHaptics.playClick();
    logger.log('info', 'App', 'ShareToXTriggered', { format });
    const name = sanitizeFilename(badgeData.name);

    try {
      if (format === 'pfp') {
        const canvas = pfpCanvasRef.current;
        if (canvas) {
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          setExportedImageUrl(dataUrl);
          downloadPng(dataUrl, `HH-Goa-2026-Frame-${name}.png`);
        }
      } else {
        if (frontCanvas) {
          const frontUrl = frontCanvas.toDataURL('image/png', 1.0);
          setExportedImageUrl(frontUrl);
          downloadPng(frontUrl, `HH-Goa-2026-FRONT-${name}.png`);
        }
        if (backCanvas) {
          window.setTimeout(() => {
            const backUrl = backCanvas.toDataURL('image/png', 1.0);
            downloadPng(backUrl, `HH-Goa-2026-BACK-${name}.png`);
          }, 250);
        }
      }
    } catch (err) {
      logger.log('error', 'App', 'ShareToXExportFailed', { error: String(err) });
      toast.error('Could not prepare images for sharing.');
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
    soundHaptics.playClick();
    setFormat(next);
    if (next === 'both' || next === 'pfp') setViewMode('2d');
  };

  const downloadLabel =
    format === 'pfp' ? 'Download frame' : format === 'both' ? 'Download both sides' : 'Download pass';

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-28 text-[var(--ivory)] sm:pb-16">
      <TropicalPalmParticles />
      <div className="grain" />

      <div
        className="pointer-events-none fixed -left-[9999px] top-0 opacity-0"
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
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10 flex flex-col items-center">
          <GoldFoilStamp />
          
          <h2 className="mt-3 mb-2 text-[2.25rem] leading-[1.05] font-semibold tracking-tight text-[var(--ivory)] sm:text-5xl">
            <ShinyGoldText text="Craft your builder pass." />
          </h2>
          <p className="m-0 text-sm leading-relaxed text-[var(--stone)] sm:text-base font-sans">
            A quiet studio for the Hacker House Goa residency. Portrait, details, download.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Left Form Controls Column */}
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

          {/* Right Sticky Pass Preview Column - ALWAYS PINNED TO TOP-20 WHILE SCROLLING */}
          <div className="order-1 lg:order-2 lg:col-span-7 lg:sticky lg:top-20 lg:self-start z-30">
            <div className="panel overflow-hidden rounded-2xl p-4 sm:p-5 shadow-2xl bg-[#0e3d22]/95 border border-[var(--line-strong)]">
              <div className="mb-3 flex flex-col gap-3 border-b border-[var(--line)] pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="m-0 text-[10px] uppercase tracking-[0.22em] text-[var(--brass)] font-mono">
                    Preview
                  </p>
                  <p className="mt-0.5 mb-0 text-xs text-[var(--stone)] font-sans">
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
                      onChange={(m) => { soundHaptics.playClick(); setViewMode(m); }}
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
                      onChange={(side) => { soundHaptics.playClick(); setCardSide(side); }}
                      options={[
                        { id: 'front', label: 'Front' },
                        { id: 'back', label: 'Back' },
                      ]}
                    />
                  )}
                </div>
              </div>

              <div className="flex min-h-[360px] flex-col items-center justify-center sm:min-h-[420px] scale-95 lg:scale-100 transition-transform origin-top">
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
                          <span className="mb-1 text-[10px] uppercase tracking-[0.22em] text-[var(--brass)] font-mono">
                            Front
                          </span>
                          <PhysicsLanyardCard>
                            <FrontCardCanvas badgeData={badgeData} />
                          </PhysicsLanyardCard>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="mb-1 text-[10px] uppercase tracking-[0.22em] text-[var(--stone)] font-mono">
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

              <div className="mt-3 hidden gap-3 border-t border-[var(--line)] pt-3 lg:grid lg:grid-cols-2">
                <Button onClick={handleDownload} className="w-full py-2.5 text-xs active:scale-95">
                  <Download className="size-4" />
                  {downloadLabel}
                </Button>
                <Button variant="secondary" onClick={handleShareToX} className="w-full py-2.5 text-xs active:scale-95">
                  <XIcon className="size-4" />
                  Share on X
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 mx-auto mt-12 flex w-full max-w-7xl items-center justify-between px-4 pb-6 text-[11px] tracking-wide text-[var(--muted)] sm:px-6 font-mono">
        <Logo compact showWordmark={false} />
        <p className="m-0 uppercase font-bold text-[var(--brass)]">HACKER HOUSE GOA · 28 - 31 OCT 2026</p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_88%,transparent)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleDownload} className="py-3 text-xs active:scale-95">
            <Download className="size-4" />
            Download
          </Button>
          <Button variant="secondary" onClick={handleShareToX} className="py-3 text-xs active:scale-95">
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
            background: '#114E2C',
            border: '1px solid rgba(196,164,106,0.3)',
            color: '#F3EDE3',
            fontFamily: 'Manrope, sans-serif',
          },
        }}
      />
    </div>
  );
}

export default App;
