import { useState, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { PhotoUploader } from './components/PhotoUploader';
import { CanvasControls } from './components/CanvasControls';
import { CustomizerPanel } from './components/CustomizerPanel';
import { FrontCardCanvas } from './components/FrontCardCanvas';
import { BackCardCanvas } from './components/BackCardCanvas';
import { PfpFrameCanvas } from './components/PfpFrameCanvas';
import { ShareModal } from './components/ShareModal';
import { PhysicsBackground } from './components/PhysicsBackground';
import { PhysicsLanyardCard } from './components/PhysicsLanyardCard';
import { R3FLanyard } from './components/R3FLanyard';
import type { BadgeData, FormatType, CardSide } from './types';
import { Download, Zap, Sparkles, Box } from 'lucide-react';
import { XIcon } from './components/icons';

export function App() {
  const [format, setFormat] = useState<FormatType>('card');
  const [cardSide, setCardSide] = useState<CardSide>('front');

  // DEFAULT VIEW MODE SET TO '2d'
  const [viewMode, setViewMode] = useState<'r3f' | '2d'>('2d');

  const [badgeData, setBadgeData] = useState<BadgeData>({
    name: 'AKSHAT LAKHERA',
    role: 'RESIDENT',
    team: 'TEAM DOOM',
    badgeId: 'HHG-8829-X',
    photoUrl: null,
    cardBgTheme: 'cyber',
    customBgUrl: null,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    filter: 'none',
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string | null>(null);

  const [frontCanvas, setFrontCanvas] = useState<HTMLCanvasElement | null>(null);
  const [backCanvas, setBackCanvas] = useState<HTMLCanvasElement | null>(null);
  const pfpCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const updateBadgeData = (updates: Partial<BadgeData>) => {
    setBadgeData((prev) => ({ ...prev, ...updates }));
  };

  const handlePhotoSelected = (url: string | null) => {
    setBadgeData((prev) => ({ ...prev, photoUrl: url }));
  };

  const getActiveCanvas = useCallback((): HTMLCanvasElement | null => {
    if (format === 'pfp') return pfpCanvasRef.current;
    if (cardSide === 'back') return backCanvas;
    return frontCanvas || backCanvas || pfpCanvasRef.current;
  }, [format, cardSide, frontCanvas, backCanvas]);

  const handleDownload = () => {
    const formattedName = (badgeData.name || 'Attendee').replace(/\s+/g, '_');

    if (format === 'pfp') {
      const canvas = pfpCanvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setExportedImageUrl(dataUrl);
      const link = document.createElement('a');
      link.download = `HH-Goa-2026-PFP-${formattedName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (frontCanvas) {
        const frontUrl = frontCanvas.toDataURL('image/png', 1.0);
        setExportedImageUrl(frontUrl);
        const linkFront = document.createElement('a');
        linkFront.download = `HH-Goa-2026-FRONT-${formattedName}.png`;
        linkFront.href = frontUrl;
        document.body.appendChild(linkFront);
        linkFront.click();
        document.body.removeChild(linkFront);
      }

      if (backCanvas) {
        setTimeout(() => {
          const backUrl = backCanvas.toDataURL('image/png', 1.0);
          const linkBack = document.createElement('a');
          linkBack.download = `HH-Goa-2026-BACK-${formattedName}.png`;
          linkBack.href = backUrl;
          document.body.appendChild(linkBack);
          linkBack.click();
          document.body.removeChild(linkBack);
        }, 250);
      }
    }

    setShareModalOpen(true);
  };

  // Direct Share to x.com intent tagging @247pmstudio & official hashtags
  const handleShareToX = () => {
    const canvas = getActiveCanvas();
    let dataUrl: string | null = null;
    if (canvas) {
      dataUrl = canvas.toDataURL('image/png', 1.0);
      setExportedImageUrl(dataUrl);

      const link = document.createElement('a');
      link.download = `HH-Goa-2026-${format === 'pfp' ? 'PFP' : cardSide.toUpperCase()}-${badgeData.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      canvas.toBlob((blob) => {
        if (blob && navigator.clipboard && navigator.clipboard.write) {
          try {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          } catch (e) {
            console.warn('Clipboard image copy not allowed without user gesture focus', e);
          }
        }
      }, 'image/png');
    }

    const tweetText = `Just created my official Hacker House Goa 2026 ${
      format === 'pfp' ? 'PFP Frame' : 'Pass'
    }! 🌴⚡\nRole: ${badgeData.role || 'RESIDENT'}\n\nSee you at @247pmstudio! 🚀 #HackerHouseGoa #FrameInGoa #HHGoa2026`;

    const xIntentUrl = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`;
    window.open(xIntentUrl, '_blank');

    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white pb-16 relative overflow-x-hidden">
      <div className="hidden">
        <FrontCardCanvas
          badgeData={badgeData}
          onCanvasReady={(c) => {
            setFrontCanvas(c);
          }}
        />
        <BackCardCanvas
          onCanvasReady={(c) => {
            setBackCanvas(c);
          }}
        />
        <PfpFrameCanvas
          badgeData={badgeData}
          onCanvasReady={(c) => {
            pfpCanvasRef.current = c;
          }}
        />
      </div>

      <PhysicsBackground />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-lime-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <Header
        format={format}
        setFormat={(f) => {
          setFormat(f);
          if (f === 'both') {
            setViewMode('2d');
          }
        }}
      />

      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 flex-1">
        <div className="mb-6 text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/10 via-lime-500/10 to-purple-500/10 border border-white/10 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-lime-400 fill-lime-400" />
            <span>2D HD Render Engine &bull; Custom Card Backgrounds &bull; 3D Physics Toggle</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight m-0">
            Hacker House Goa <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-lime-400 to-amber-300">Pass Generator</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Customize your official pass, upload custom background wallpapers, or switch to 3D spring lanyard mode!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Photo Upload
              </label>
              <PhotoUploader
                onPhotoSelected={handlePhotoSelected}
                currentPhoto={badgeData.photoUrl}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Photo Position & Filter
              </label>
              <CanvasControls badgeData={badgeData} updateBadgeData={updateBadgeData} />
            </div>

            {(format === 'card' || format === 'both') && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Card Details & Background Theme
                </label>
                <CustomizerPanel
                  badgeData={badgeData}
                  updateBadgeData={updateBadgeData}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-7 sticky top-24 space-y-4">
            <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-4 mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-lime-400 animate-ping" />
                  <span className="text-sm font-bold text-white font-display">
                    {format === 'both' ? '2D HD Dual Front & Back View' : viewMode === '2d' ? '2D HD Preview' : 'R3F Spring Lanyard 3D Physics'}
                  </span>
                </div>

                <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-white/10 text-xs font-semibold">
                  <button
                    onClick={() => setViewMode('2d')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      viewMode === '2d'
                        ? 'bg-cyan-500 text-black font-extrabold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>2D HD Render (Default)</span>
                  </button>

                  <button
                    onClick={() => setViewMode('r3f')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      viewMode === 'r3f'
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-extrabold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Physics</span>
                  </button>
                </div>

                {viewMode === '2d' && format === 'card' && (
                  <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-white/10 text-xs font-semibold">
                    <button
                      onClick={() => setCardSide('front')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        cardSide === 'front' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
                      }`}
                    >
                      Front
                    </button>
                    <button
                      onClick={() => setCardSide('back')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        cardSide === 'back' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
                      }`}
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-center min-h-[460px]">
                {format === 'both' ? (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full py-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-cyan-400 mb-1 tracking-wider uppercase">Front Side</span>
                      <PhysicsLanyardCard>
                        <FrontCardCanvas badgeData={badgeData} />
                      </PhysicsLanyardCard>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-lime-400 mb-1 tracking-wider uppercase">Back Side</span>
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
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-lime-400 text-black font-extrabold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Both Front & Back PNGs</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareToX}
                  className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-slate-900 border border-white/20 text-white hover:bg-slate-800 font-extrabold text-base hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <XIcon className="w-5 h-5 fill-current text-cyan-400" />
                  <span>Share to X (#FrameInGoa)</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>Card Background Customization &bull; R3F Lanyard Physics</span>
              </div>
              <span className="font-mono text-cyan-400">#HackerHouseGoa #FrameInGoa #HHGoa2026</span>
            </div>
          </div>
        </div>
      </main>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        imageUrl={exportedImageUrl}
        badgeName={badgeData.name}
        badgeTitle={badgeData.role}
        formatType={format}
      />
    </div>
  );
}

export default App;
