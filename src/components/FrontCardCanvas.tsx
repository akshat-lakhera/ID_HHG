import { useEffect, useRef } from 'react';
import type { BadgeData } from '../types';
import { BRAND } from '../lib/brand';
import { drawCoverPhoto, fitText, loadImage, waitForFonts } from '../lib/images';
import { drawLogoMark } from '../lib/drawLogo';

interface FrontCardCanvasProps {
  badgeData: BadgeData;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

function drawQRCode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  codeText: string,
  accentColor: string
) {
  ctx.save();
  ctx.fillStyle = 'rgba(12, 11, 9, 0.88)';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, 6);
  ctx.fill();
  ctx.stroke();

  const padding = 8;
  const qrSize = size - padding * 2;
  const modules = 21;
  const cellSize = qrSize / modules;
  const startX = x + padding;
  const startY = y + padding;

  const getModuleBit = (r: number, c: number) => {
    if ((r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7)) {
      if (r === 0 || r === 6 || c === 0 || c === 6 || r === 14 || r === 20 || c === 14 || c === 20)
        return 1;
      if (r === 1 || r === 5 || c === 1 || c === 5 || r === 15 || r === 19 || c === 15 || c === 19)
        return 0;
      return 1;
    }
    if (r === 6 || c === 6) return (r + c) % 2 === 0 ? 1 : 0;

    let hash = 0;
    for (let i = 0; i < codeText.length; i++) {
      hash = (hash << 5) - hash + codeText.charCodeAt(i);
      hash |= 0;
    }
    return (r * 31 + c * 17 + Math.abs(hash)) % 100 > 45 ? 1 : 0;
  };

  ctx.fillStyle = BRAND.ivory;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (getModuleBit(r, c) === 1) {
        ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 0.4, cellSize - 0.4);
      }
    }
  }
  ctx.restore();
}

export function FrontCardCanvas({ badgeData, onCanvasReady }: FrontCardCanvasProps) {
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

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 24);
      ctx.clip();

      let customImg: HTMLImageElement | null = null;
      if (badgeData.customBgUrl) {
        try {
          customImg = await loadImage(badgeData.customBgUrl);
        } catch {
          customImg = null;
        }
      }
      if (cancelled) return;

      if (customImg) {
        ctx.drawImage(customImg, 0, 0, width, height);
        ctx.fillStyle = 'rgba(12, 11, 9, 0.38)';
        ctx.fillRect(0, 0, width, height);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#14110d');
        bgGrad.addColorStop(0.55, '#0c0b09');
        bgGrad.addColorStop(1, '#16130f');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const glow = ctx.createRadialGradient(width / 2, 360, 20, width / 2, 360, 280);
        glow.addColorStop(0, 'rgba(196, 164, 106, 0.10)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();

      ctx.strokeStyle = 'rgba(196, 164, 106, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(1.5, 1.5, width - 3, height - 3, 22);
      ctx.stroke();

      ctx.fillStyle = BRAND.laterite;
      ctx.fillRect(width - 8, 28, 8, height - 56);

      const left = 36;
      drawLogoMark(ctx, width - 52, 52, 42, BRAND.brass);

      ctx.fillStyle = BRAND.ivory;
      ctx.textAlign = 'left';
      ctx.font = '600 46px "Cormorant Garamond", Georgia, serif';
      ctx.fillText('Hacker', left, 78);
      ctx.fillText('House', left, 124);
      ctx.font = 'italic 500 40px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = BRAND.brass;
      ctx.fillText('Goa', left, 168);

      ctx.fillStyle = BRAND.brass;
      ctx.fillRect(left, 190, 28, 1);
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.fillStyle = 'rgba(243, 237, 227, 0.55)';
      ctx.fillText('BUILDER PASS  ·  2026', left + 36, 195);

      const photoX = width / 2 - 4;
      const photoY = 360;
      const photoR = 108;

      ctx.save();
      ctx.strokeStyle = BRAND.brass;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoR + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#16130f';
      ctx.fillRect(photoX - photoR, photoY - photoR, photoR * 2, photoR * 2);

      if (badgeData.photoUrl) {
        try {
          const img = await loadImage(badgeData.photoUrl);
          if (!cancelled) {
            drawCoverPhoto(
              ctx,
              img,
              photoX,
              photoY,
              photoR * 2,
              badgeData.scale,
              badgeData.offsetX,
              badgeData.offsetY,
              badgeData.rotation,
              badgeData.filter
            );
          }
        } catch {
          /* keep placeholder */
        }
      } else {
        ctx.fillStyle = 'rgba(243, 237, 227, 0.12)';
        ctx.beginPath();
        ctx.arc(photoX, photoY - 16, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(photoX, photoY + 72, 58, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.font = '500 11px "IBM Plex Mono", monospace';
        ctx.fillStyle = BRAND.brass;
        ctx.textAlign = 'center';
        ctx.fillText('ADD PORTRAIT', photoX, photoY + 40);
      }
      ctx.restore();
      if (cancelled) return;

      const name = (badgeData.name || 'ATTENDEE').trim() || 'ATTENDEE';
      let nameParts = name.toUpperCase().split(/\s+/).filter(Boolean);
      if (nameParts.length === 1 && nameParts[0].length > 14) {
        const token = nameParts[0];
        const mid = Math.ceil(token.length / 2);
        nameParts = [token.slice(0, mid), token.slice(mid)];
      }
      const nameY = 530;
      const maxNameW = width - left * 2;

      ctx.fillStyle = BRAND.ivory;
      ctx.textAlign = 'left';
      if (nameParts.length >= 2) {
        const first = nameParts[0];
        const rest = nameParts.slice(1).join(' ');
        fitText(ctx, first, maxNameW, 600, 36, 14, '"Cormorant Garamond", Georgia, serif');
        ctx.fillText(first, left, nameY);
        fitText(ctx, rest, maxNameW, 600, 36, 14, '"Cormorant Garamond", Georgia, serif');
        ctx.fillText(rest, left, nameY + 40);
      } else {
        fitText(ctx, nameParts[0], maxNameW, 600, 40, 14, '"Cormorant Garamond", Georgia, serif');
        ctx.fillText(nameParts[0], left, nameY);
      }

      const roleY = nameParts.length >= 2 ? nameY + 78 : nameY + 44;
      const role = (badgeData.role || 'RESIDENT').trim() || 'RESIDENT';
      const team = (badgeData.team || 'HOUSE').trim() || 'HOUSE';
      const roleText = `${role}  /  ${team}`.toUpperCase();

      ctx.fillStyle = BRAND.laterite;
      ctx.beginPath();
      ctx.arc(left + 4, roleY - 4, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '500 12px "IBM Plex Mono", monospace';
      ctx.fillStyle = BRAND.brassSoft;
      ctx.fillText(roleText.slice(0, 36), left + 16, roleY);

      const id = (badgeData.badgeId || 'HHG-0000-X').trim() || 'HHG-0000-X';
      const boxY = roleY + 28;
      ctx.strokeStyle = 'rgba(196, 164, 106, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(left, boxY, 176, 34);
      ctx.font = '500 13px "IBM Plex Mono", monospace';
      ctx.fillStyle = BRAND.brass;
      ctx.fillText(id.slice(0, 18), left + 14, boxY + 22);

      const qrSize = 86;
      const qrX = width - left - qrSize;
      const qrY = boxY - 48;
      drawQRCode(
        ctx,
        qrX,
        qrY,
        qrSize,
        `https://hackerhousegoa.com/pass/${encodeURIComponent(id)}`,
        BRAND.brass
      );
      ctx.font = '500 8px "IBM Plex Mono", monospace';
      ctx.fillStyle = 'rgba(243, 237, 227, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN PASS', qrX + qrSize / 2, qrY + qrSize + 14);

      if (!cancelled) onCanvasReady?.(canvas);
      } catch (err) {
        console.warn('Front card render failed', err);
        if (!cancelled && canvasRef.current) onCanvasReady?.(canvasRef.current);
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [badgeData, onCanvasReady]);

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
