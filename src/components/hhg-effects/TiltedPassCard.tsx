import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TiltedPassCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number;
}

export function TiltedPassCard({ children, className = '', maxRotation = 10 }: TiltedPassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rY = ((mouseX - width / 2) / (width / 2)) * maxRotation;
    const rX = -((mouseY - height / 2) / (height / 2)) * maxRotation;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="perspective-1000 py-2 flex justify-center items-center w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.4 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[#0e3d22]/95 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)] transition-shadow duration-300 ${className}`}
      >
        <div className="relative z-10" style={{ transform: 'translateZ(15px)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
