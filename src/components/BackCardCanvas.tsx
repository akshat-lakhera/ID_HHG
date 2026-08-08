import React, { useEffect, useRef } from 'react';

interface BackCardCanvasProps {
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const BackCardCanvas: React.FC<BackCardCanvasProps> = ({ onCanvasReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High definition canvas dimensions (450 x 820)
    const width = 450;
    const height = 820;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // --- 1. Dark Card Background ---
    ctx.save();
    ctx.fillStyle = '#0a0f14';
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 24);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // --- 2. Top Logo Box ---
    const logoBoxX = 35;
    const logoBoxY = 40;
    const logoBoxW = width - 70;
    const logoBoxH = 140;

    ctx.fillStyle = '#1a1e24';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(logoBoxX, logoBoxY, logoBoxW, logoBoxH, 16);
    ctx.fill();
    ctx.stroke();

    // Cyan "LOGO" text & underline
    ctx.font = '900 44px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.textAlign = 'center';
    ctx.fillText('LOGO', width / 2, logoBoxY + 70);

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 50, logoBoxY + 84);
    ctx.lineTo(width / 2 + 50, logoBoxY + 84);
    ctx.stroke();

    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Hacker House Goa', width / 2, logoBoxY + 115);

    // --- 3. Terms & Conditions Section ---
    const termsY = 225;
    ctx.textAlign = 'left';

    ctx.font = '800 16px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('TERMS & CONDITIONS', logoBoxX, termsY);

    ctx.font = '400 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#cbd5e1';

    const bullets = [
      '• This card is property of Hacker House Goa and',
      '  must be returned upon request.',
      '• Unauthorized access or misuse is strictly',
      '  prohibited and subject to immediate penalty.',
      '• Cardholder assumes all risks associated with',
      '  the use of these facilities.'
    ];

    let currentY = termsY + 28;
    bullets.forEach((line) => {
      ctx.fillText(line, logoBoxX, currentY);
      currentY += 21;
    });

    // --- 4. Signature Authority Section ---
    const sigY = 445;
    ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Signature Authority', logoBoxX, sigY);

    ctx.font = 'italic 400 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Security Director', logoBoxX, sigY + 22);

    // Signature digital curve line
    const sigStartX = width - 180;
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sigStartX, sigY + 10);
    ctx.bezierCurveTo(sigStartX + 20, sigY - 15, sigStartX + 40, sigY + 25, sigStartX + 60, sigY - 10);
    ctx.bezierCurveTo(sigStartX + 80, sigY + 15, sigStartX + 100, sigY - 20, sigStartX + 120, sigY + 5);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sigStartX - 10, sigY + 18);
    ctx.lineTo(width - 40, sigY + 18);
    ctx.stroke();

    // --- 5. Contact Info Section ---
    const contactY = 540;
    const iconX = logoBoxX;
    const textX = logoBoxX + 30;

    // Location Icon & Address
    ctx.fillStyle = '#06b6d4';
    ctx.font = '16px sans-serif';
    ctx.fillText('📍', iconX, contactY);
    ctx.font = '600 13px "Fira Code", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('123 Hacker St, Anjuna, Goa 403509', textX, contactY - 2);

    // Email Icon & Address
    ctx.font = '16px sans-serif';
    ctx.fillText('✉️', iconX, contactY + 38);
    ctx.font = '600 13px "Fira Code", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('security@hackerhousegoa.com', textX, contactY + 36);

    // Phone Icon & Numbers
    ctx.font = '16px sans-serif';
    ctx.fillText('📞', iconX, contactY + 76);
    ctx.font = '600 13px "Fira Code", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('+91 000 000 0000, 1800-HACK-GOA', textX, contactY + 74);

    // --- 6. Bottom Banner ---
    const bannerH = 65;
    const bannerY = height - bannerH - 25;
    const bannerW = width - 70;

    ctx.fillStyle = '#0891b2'; // Cyan teal fill
    ctx.beginPath();
    ctx.roundRect(logoBoxX, bannerY, bannerW, bannerH, 12);
    ctx.fill();

    ctx.font = '800 15px "Fira Code", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('PROPERTY OF HACKER HOUSE GOA', width / 2, bannerY + 38);

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [onCanvasReady]);

  return (
    <div className="relative flex items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        className="w-full max-w-[360px] rounded-3xl shadow-2xl shadow-cyan-950/60 border border-white/10 transition-all duration-300"
      />
    </div>
  );
};
