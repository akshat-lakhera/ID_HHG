import React, { useEffect, useRef } from 'react';
import type { BadgeData } from '../types';

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

  ctx.fillStyle = 'rgba(8, 13, 20, 0.85)';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, 8);
  ctx.fill();
  ctx.stroke();

  const padding = 8;
  const qrSize = size - padding * 2;
  const modules = 21;
  const cellSize = qrSize / modules;
  const startX = x + padding;
  const startY = y + padding;

  const getModuleBit = (r: number, c: number) => {
    if (
      (r < 7 && c < 7) ||
      (r < 7 && c >= 14) ||
      (r >= 14 && c < 7)
    ) {
      if (r === 0 || r === 6 || c === 0 || c === 6 || r === 14 || r === 20 || c === 14 || c === 20) return 1;
      if (r === 1 || r === 5 || c === 1 || c === 5 || r === 15 || r === 19 || c === 15 || c === 19) return 0;
      return 1;
    }
    if (r === 6 || c === 6) return (r + c) % 2 === 0 ? 1 : 0;

    let hash = 0;
    for (let i = 0; i < codeText.length; i++) {
      hash = (hash << 5) - hash + codeText.charCodeAt(i);
      hash |= 0;
    }
    const val = (r * 31 + c * 17 + Math.abs(hash)) % 100;
    return val > 45 ? 1 : 0;
  };

  ctx.fillStyle = '#ffffff';
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (getModuleBit(r, c) === 1) {
        ctx.fillRect(
          startX + c * cellSize,
          startY + r * cellSize,
          cellSize - 0.4,
          cellSize - 0.4
        );
      }
    }
  }

  ctx.fillStyle = accentColor;
  ctx.fillRect(x + size / 2 - 3, y + size / 2 - 3, 6, 6);

  ctx.restore();
}

export const FrontCardCanvas: React.FC<FrontCardCanvasProps> = ({
  badgeData,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 450;
    const height = 820;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // --- 1. Card Background Fill / Custom Image ---
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 24);
    ctx.clip();

    const bgAccentColor = '#06b6d4';

    if (badgeData.customBgUrl) {
      const customImg = new Image();
      customImg.crossOrigin = 'anonymous';
      customImg.src = badgeData.customBgUrl;

      if (customImg.complete && customImg.naturalWidth !== 0) {
        ctx.drawImage(customImg, 0, 0, width, height);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#070c14');
        bgGrad.addColorStop(0.5, '#0c1626');
        bgGrad.addColorStop(1, '#050911');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#070c14');
      bgGrad.addColorStop(0.5, '#0c1626');
      bgGrad.addColorStop(1, '#050911');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const radialGlow = ctx.createRadialGradient(width / 2, 370, 20, width / 2, 370, 260);
      radialGlow.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();

    ctx.strokeStyle = bgAccentColor + '44';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // --- 2. Right Accent Neon Lime Bar ---
    ctx.save();
    ctx.fillStyle = '#a3e635';
    ctx.shadowColor = '#a3e635';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(width - 12, 0, 12, height, [0, 24, 24, 0]);
    ctx.fill();
    ctx.restore();

    // --- 3. Header Typography ---
    const leftMargin = 35;

    ctx.font = '900 48px "Space Grotesk", "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('HACKER', leftMargin, 85);
    ctx.fillText('HOUSE', leftMargin, 132);
    ctx.fillText('GOA', leftMargin, 179);

    ctx.fillStyle = '#eab308';
    ctx.fillRect(leftMargin, 202, 4, 16);

    ctx.font = '700 13px "Fira Code", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('AUTHORIZATION PROTOCOL', leftMargin + 12, 215);

    // --- 4. Circular Photo Area ---
    const photoCenterX = width / 2 - 5;
    const photoCenterY = 370;
    const photoRadius = 110;

    ctx.save();
    ctx.shadowColor = bgAccentColor;
    ctx.shadowBlur = 25;
    ctx.strokeStyle = bgAccentColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY, photoRadius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#0b1320';
    ctx.fillRect(photoCenterX - photoRadius, photoCenterY - photoRadius, photoRadius * 2, photoRadius * 2);

    if (badgeData.photoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = badgeData.photoUrl;

      if (img.complete && img.naturalWidth !== 0) {
        ctx.save();
        const imgX = photoCenterX + badgeData.offsetX;
        const imgY = photoCenterY + badgeData.offsetY;
        ctx.translate(imgX, imgY);
        ctx.rotate((badgeData.rotation * Math.PI) / 180);

        if (badgeData.filter === 'vivid') {
          ctx.filter = 'contrast(125%) saturate(140%)';
        } else if (badgeData.filter === 'cyber') {
          ctx.filter = 'contrast(130%) hue-rotate(180deg) saturate(150%)';
        } else if (badgeData.filter === 'vintage') {
          ctx.filter = 'sepia(40%) contrast(110%) saturate(120%)';
        } else if (badgeData.filter === 'bw') {
          ctx.filter = 'grayscale(100%) contrast(140%)';
        } else {
          ctx.filter = 'none';
        }

        const diameter = photoRadius * 2;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        let drawW = diameter * badgeData.scale;
        let drawH = diameter * badgeData.scale;

        if (imgRatio > 1) {
          drawW = diameter * imgRatio * badgeData.scale;
        } else {
          drawH = (diameter / imgRatio) * badgeData.scale;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY - 18, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY + 70, 62, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.font = '700 12px "Fira Code", monospace';
      ctx.fillStyle = bgAccentColor;
      ctx.textAlign = 'center';
      ctx.fillText('UPLOAD PHOTO', photoCenterX, photoCenterY + 42);
    }
    ctx.restore();

    // --- 5. Cardholder Name ---
    const nameYStart = 540;
    const nameParts = (badgeData.name || 'AKSHAT LAKHERA').toUpperCase().split(' ');

    ctx.font = '800 36px "Space Grotesk", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';

    if (nameParts.length >= 2) {
      ctx.fillText(nameParts[0], leftMargin, nameYStart);
      ctx.fillText(nameParts.slice(1).join(' '), leftMargin, nameYStart + 42);
    } else {
      ctx.fillText(nameParts[0], leftMargin, nameYStart);
    }

    // --- 6. Role / Team Indicator ---
    const roleY = nameParts.length >= 2 ? nameYStart + 85 : nameYStart + 45;

    ctx.fillStyle = '#a3e635';
    ctx.beginPath();
    ctx.arc(leftMargin + 6, roleY - 5, 5, 0, Math.PI * 2);
    ctx.fill();

    const roleText = `${badgeData.role || 'RESIDENT'} / ${badgeData.team || 'TEAM DOOM'}`.toUpperCase();
    ctx.font = '700 15px "Fira Code", monospace';
    ctx.fillStyle = '#a3e635';
    ctx.fillText(roleText, leftMargin + 20, roleY);

    // --- 7. ID Badge Box ---
    const badgeBoxY = roleY + 30;
    const badgeBoxW = 180;
    const badgeBoxH = 38;

    ctx.fillStyle = bgAccentColor + '18';
    ctx.strokeStyle = bgAccentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(leftMargin, badgeBoxY, badgeBoxW, badgeBoxH);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 15px "Fira Code", monospace';
    ctx.fillStyle = bgAccentColor;
    ctx.fillText(badgeData.badgeId || 'HHG-8829-X', leftMargin + 38, badgeBoxY + 24);

    // --- 8. QR CODE AT FRONT ---
    const qrSize = 90;
    const qrX = width - leftMargin - qrSize - 10;
    const qrY = badgeBoxY - 52;

    drawQRCode(
      ctx,
      qrX,
      qrY,
      qrSize,
      `https://hackerhousegoa.com/pass/${badgeData.badgeId || 'HHG-8829-X'}`,
      bgAccentColor
    );

    ctx.font = '700 9px "Fira Code", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN PASS', qrX + qrSize / 2, qrY + qrSize + 14);

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [badgeData, onCanvasReady]);

  return (
    <div className="relative flex items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        className="w-full max-w-[360px] rounded-3xl shadow-2xl shadow-cyan-950/60 border border-cyan-500/30 transition-all duration-300"
      />
    </div>
  );
};
