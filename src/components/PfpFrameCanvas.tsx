import { useEffect, useRef } from 'react';
import type { BadgeData } from '../types';
import { BRAND } from '../lib/brand';
import { drawCoverPhoto, loadImage, waitForFonts } from '../lib/images';
import hhgLogoUrl from '../assets/hhg_logo.png';

interface PfpFrameCanvasProps {
  badgeData: BadgeData;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function PfpFrameCanvas({ badgeData, onCanvasReady }: PfpFrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let cancelled = false;

    const size = 1000;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = BRAND.ink;
    ctx.fillRect(0, 0, size, size);

    const render = async () => {
      try {
        await waitForFonts();
        if (cancelled || !canvasRef.current) return;
        const center = size / 2;
        ctx.clearRect(0, 0, size, size);

        ctx.fillStyle = BRAND.ink;
        ctx.fillRect(0, 0, size, size);

        const glow = ctx.createRadialGradient(center, center, 80, center, center, 480);
        glow.addColorStop(0, 'rgba(196, 164, 106, 0.16)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, size, size);

        const photoRadius = 372;
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, photoRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = BRAND.inkSoft;
        ctx.fillRect(0, 0, size, size);

        if (badgeData.photoUrl) {
          try {
            const img = await loadImage(badgeData.photoUrl);
            if (!cancelled) {
              drawCoverPhoto(
                ctx,
                img,
                center,
                center,
                photoRadius * 2,
                badgeData.scale,
                badgeData.offsetX,
                badgeData.offsetY,
                badgeData.rotation,
                badgeData.filter
              );
            }
          } catch {
            /* placeholder remains */
          }
        } else {
          ctx.fillStyle = 'rgba(243, 237, 227, 0.1)';
          ctx.beginPath();
          ctx.arc(center, center - 40, 90, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(center, center + 160, 160, Math.PI, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        if (cancelled) return;

        ctx.strokeStyle = BRAND.brass;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(center, center, photoRadius + 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(243, 237, 227, 0.28)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(center, center, photoRadius - 2, 0, Math.PI * 2);
        ctx.stroke();

        const topW = 420;
        const topH = 56;
        const topX = center - topW / 2;
        const topY = center - photoRadius - 18;
        ctx.fillStyle = BRAND.ink;
        ctx.strokeStyle = BRAND.brass;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(topX, topY, topW, topH, 28);
        ctx.fill();
        ctx.stroke();
        ctx.font = '600 26px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = BRAND.ivory;
        ctx.textAlign = 'center';
        ctx.fillText('Hacker House Goa', center, topY + 37);

        const role = (badgeData.role || 'RESIDENT').toUpperCase();
        const team = (badgeData.team || 'HOUSE').toUpperCase();
        const btmW = 500;
        const btmH = 58;
        const btmX = center - btmW / 2;
        const btmY = center + photoRadius - 32;
        ctx.fillStyle = BRAND.ink;
        ctx.strokeStyle = 'rgba(184, 92, 56, 0.7)';
        ctx.beginPath();
        ctx.roundRect(btmX, btmY, btmW, btmH, 29);
        ctx.fill();
        ctx.stroke();
        ctx.font = '500 20px "IBM Plex Mono", monospace';
        ctx.fillStyle = BRAND.brassSoft;
        ctx.fillText(`${role}  ·  ${team}`.slice(0, 42), center, btmY + 37);

        // Load and render OFFICIAL HACKER HOUSE GOA LOGO at the bottom
        let hhgLogoImg: HTMLImageElement | null = null;
        try {
          hhgLogoImg = await loadImage(hhgLogoUrl);
        } catch {
          hhgLogoImg = null;
        }

        if (hhgLogoImg) {
          ctx.save();
          const logoW = 100;
          const logoH = 60;
          const logoX = center - logoW / 2;
          const logoY = size - 90;

          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.roundRect(logoX, logoY, logoW, logoH, 8);
          ctx.clip();
          ctx.drawImage(hhgLogoImg, logoX, logoY, logoW, logoH);
          ctx.restore();

          ctx.strokeStyle = 'rgba(196, 164, 106, 0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(center - logoW / 2, size - 90, logoW, logoH, 8);
          ctx.stroke();
        }

        if (!cancelled) onCanvasReady?.(canvas);
      } catch (err) {
        console.warn('PFP frame render failed', err);
        if (!cancelled && canvasRef.current) onCanvasReady?.(canvasRef.current);
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [badgeData, onCanvasReady]);

  return (
    <div className="relative flex items-center justify-center p-2 sm:p-4">
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="aspect-square h-auto w-full max-w-[280px] rounded-full border border-[var(--line)] shadow-[0_28px_60px_-28px_rgba(0,0,0,0.7)] sm:max-w-[380px]"
      />
    </div>
  );
}
