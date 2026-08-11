import { useEffect, useRef } from 'react';
import { BRAND } from '../lib/brand';
import { loadImage, waitForFonts } from '../lib/images';
import hhgLogoUrl from '../assets/hhg_logo.png';

interface BackCardCanvasProps {
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function BackCardCanvas({ onCanvasReady }: BackCardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let cancelled = false;

    const width = 450;
    const height = 820;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = BRAND.ink;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 24);
    ctx.fill();

    const render = async () => {
      try {
        await waitForFonts();
        if (cancelled || !canvasRef.current) return;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = BRAND.ink;
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(196, 164, 106, 0.28)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const pad = 36;
        ctx.strokeStyle = 'rgba(196, 164, 106, 0.16)';
        ctx.strokeRect(pad, 40, width - pad * 2, 150);

        // Load and render OFFICIAL HACKER HOUSE GOA LOGO
        let hhgLogoImg: HTMLImageElement | null = null;
        try {
          hhgLogoImg = await loadImage(hhgLogoUrl);
        } catch {
          hhgLogoImg = null;
        }

        if (hhgLogoImg) {
          ctx.save();
          const logoW = 120;
          const logoH = 76;
          const logoX = width / 2 - logoW / 2;
          const logoY = 52;

          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.roundRect(logoX, logoY, logoW, logoH, 10);
          ctx.clip();
          ctx.drawImage(hhgLogoImg, logoX, logoY, logoW, logoH);
          ctx.restore();

          ctx.strokeStyle = 'rgba(196, 164, 106, 0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(width / 2 - logoW / 2, 52, logoW, logoH, 10);
          ctx.stroke();
        }

        ctx.textAlign = 'center';
        ctx.font = '500 13px "IBM Plex Mono", monospace';
        ctx.fillStyle = BRAND.stone;
        ctx.fillText('HACKER HOUSE GOA  ·  28-31 OCT 2026', width / 2, 164);

        ctx.textAlign = 'left';
        ctx.font = '600 15px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = BRAND.brass;
        ctx.fillText('Terms', pad, 230);

        ctx.font = '400 13px Manrope, sans-serif';
        ctx.fillStyle = 'rgba(243, 237, 227, 0.72)';
        const bullets = [
          'This pass remains property of Hacker House Goa',
          'and must be presented on request.',
          'Misuse or transfer is not permitted.',
          'The holder assumes all risk while using the house.',
        ];
        let y = 258;
        bullets.forEach((line) => {
          ctx.fillText(line, pad, y);
          y += 22;
        });

        ctx.font = '600 15px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = BRAND.ivory;
        ctx.fillText('Signature', pad, 460);
        ctx.font = 'italic 400 13px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = BRAND.stone;
        ctx.fillText('House Director', pad, 482);

        const sigX = width - 186;
        ctx.strokeStyle = BRAND.brass;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sigX, 470);
        ctx.bezierCurveTo(sigX + 20, 448, sigX + 40, 488, sigX + 60, 454);
        ctx.bezierCurveTo(sigX + 80, 478, sigX + 100, 444, sigX + 122, 468);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(243, 237, 227, 0.16)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sigX - 8, 480);
        ctx.lineTo(width - pad, 480);
        ctx.stroke();

        ctx.fillStyle = BRAND.brass;
        ctx.fillRect(pad, 540, 18, 1);
        ctx.font = '500 12px "IBM Plex Mono", monospace';
        ctx.fillStyle = BRAND.ivory;
        ctx.fillText('Anjuna, Goa 403509', pad, 568);
        ctx.fillStyle = BRAND.stone;
        ctx.fillText('security@hackerhousegoa.com', pad, 592);
        ctx.fillText('+91 000 000 0000', pad, 616);

        ctx.fillStyle = BRAND.surface;
        ctx.beginPath();
        ctx.roundRect(pad, height - 92, width - pad * 2, 52, 8);
        ctx.fill();
        ctx.font = '500 11px "IBM Plex Mono", monospace';
        ctx.fillStyle = BRAND.brass;
        ctx.textAlign = 'center';
        ctx.fillText('PROPERTY OF HACKER HOUSE GOA', width / 2, height - 60);

        if (!cancelled) onCanvasReady?.(canvas);
      } catch (err) {
        console.warn('Back card render failed', err);
        if (!cancelled && canvasRef.current) onCanvasReady?.(canvasRef.current);
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [onCanvasReady]);

  return (
    <div className="relative flex items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={450}
        height={820}
        className="aspect-[450/820] h-auto w-full max-w-[280px] rounded-[22px] border border-[var(--line)] shadow-[0_28px_60px_-28px_rgba(0,0,0,0.7)] sm:max-w-[340px]"
      />
    </div>
  );
}
