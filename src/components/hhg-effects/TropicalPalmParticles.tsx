import { useEffect, useRef } from 'react';

export function TropicalPalmParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating Gold & Emerald Sparks
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      color: Math.random() > 0.4 ? '#C4A46A' : '#1B7340',
      alpha: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.1),
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Deep Ink Background (#092614)
      ctx.fillStyle = '#092614';
      ctx.fillRect(0, 0, width, height);

      // Radial Palm Glow (Top Left)
      const grad1 = ctx.createRadialGradient(width * 0.2, height * 0.2, 20, width * 0.2, height * 0.2, width * 0.5);
      grad1.addColorStop(0, 'rgba(27, 115, 64, 0.4)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Brass Gold Horizon Glow (Bottom Right)
      const grad2 = ctx.createRadialGradient(width * 0.8, height * 0.8, 20, width * 0.8, height * 0.8, width * 0.5);
      grad2.addColorStop(0, 'rgba(196, 164, 106, 0.2)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Update and Draw Sparks
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.y) * 0.2;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time * 3 + p.x) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10" />;
}
