import React, { useEffect, useRef } from 'react';
import type { BadgeData } from '../types';

interface PfpFrameCanvasProps {
  badgeData: BadgeData;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const PfpFrameCanvas: React.FC<PfpFrameCanvasProps> = ({
  badgeData,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution square output canvas (1000 x 1000)
    const size = 1000;
    canvas.width = size;
    canvas.height = size;

    const center = size / 2;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // --- 1. Background Fill ---
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, size, size);

    // --- 2. Ambient Glowing Backdrop ---
    const ambientGlow = ctx.createRadialGradient(center, center, 100, center, center, 480);
    ambientGlow.addColorStop(0, '#06b6d444');
    ambientGlow.addColorStop(0.7, '#a3e63522');
    ambientGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = ambientGlow;
    ctx.fillRect(0, 0, size, size);

    // --- 3. User Photo Area (Circle Aperture) ---
    const photoRadius = 380;

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, photoRadius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);

    if (badgeData.photoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = badgeData.photoUrl;

      if (img.complete && img.naturalWidth !== 0) {
        ctx.save();
        const imgCenterX = center + badgeData.offsetX;
        const imgCenterY = center + badgeData.offsetY;
        ctx.translate(imgCenterX, imgCenterY);
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
    }
    ctx.restore();

    // --- 4. Outer PFP Frame Overlay & Rings ---
    const ringGrad = ctx.createConicGradient(0, center, center);
    ringGrad.addColorStop(0, '#06b6d4');
    ringGrad.addColorStop(0.33, '#a3e635');
    ringGrad.addColorStop(0.66, '#eab308');
    ringGrad.addColorStop(1, '#06b6d4');

    ctx.save();
    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = 18;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(center, center, photoRadius + 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, photoRadius - 2, 0, Math.PI * 2);
    ctx.stroke();

    // --- 5. Branding Badges around the Frame ---
    ctx.save();
    const topBadgeW = 380;
    const topBadgeH = 54;
    const topBadgeX = center - topBadgeW / 2;
    const topBadgeY = center - photoRadius - 25;

    ctx.fillStyle = '#080d14';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(topBadgeX, topBadgeY, topBadgeW, topBadgeH, 27);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 24px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('HACKER HOUSE GOA', center, topBadgeY + 36);
    ctx.restore();

    ctx.save();
    const btmBadgeW = 460;
    const btmBadgeH = 60;
    const btmBadgeX = center - btmBadgeW / 2;
    const btmBadgeY = center + photoRadius - 35;

    ctx.fillStyle = '#080d14';
    ctx.strokeStyle = '#a3e635';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#a3e635';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(btmBadgeX, btmBadgeY, btmBadgeW, btmBadgeH, 30);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#a3e635';
    ctx.textAlign = 'center';
    ctx.fillText(`● ${badgeData.role.toUpperCase()} / ${badgeData.team.toUpperCase()}`, center, btmBadgeY + 37);
    ctx.restore();

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [badgeData, onCanvasReady]);

  return (
    <div className="relative flex items-center justify-center p-2 sm:p-4">
      <canvas
        ref={canvasRef}
        className="w-full max-w-[400px] rounded-full shadow-2xl shadow-cyan-950/50 border border-white/20 transition-all duration-300 aspect-square"
      />
    </div>
  );
};
