import React, { useState, useRef, useEffect } from 'react';

interface PhysicsLanyardCardProps {
  children: React.ReactNode;
}

export const PhysicsLanyardCard: React.FC<PhysicsLanyardCardProps> = ({ children }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);
  const [transX, setTransX] = useState(0);
  const [transY, setTransY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const physicsRef = useRef({
    rx: 0, ry: 0, rz: 0,
    tx: 0, ty: 0,
    targetRx: 0, targetRy: 0, targetRz: 0,
    targetTx: 0, targetTy: 0,
    vrx: 0, vry: 0, vrz: 0,
    vtx: 0, vty: 0,
    dragStartX: 0, dragStartY: 0,
  });

  const stiffness = 0.08;
  const damping = 0.78;
  const mass = 1.2;

  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      const p = physicsRef.current;

      if (!isDragging) {
        const arx = ((p.targetRx - p.rx) * stiffness) / mass;
        const ary = ((p.targetRy - p.ry) * stiffness) / mass;
        const arz = ((p.targetRz - p.rz) * stiffness) / mass;
        const atx = ((p.targetTx - p.tx) * stiffness) / mass;
        const aty = ((p.targetTy - p.ty) * stiffness) / mass;

        p.vrx = (p.vrx + arx) * damping;
        p.vry = (p.vry + ary) * damping;
        p.vrz = (p.vrz + arz) * damping;
        p.vtx = (p.vtx + atx) * damping;
        p.vty = (p.vty + aty) * damping;

        p.rx += p.vrx;
        p.ry += p.vry;
        p.rz += p.vrz;
        p.tx += p.vtx;
        p.ty += p.vty;
      }

      setRotX(p.rx);
      setRotY(p.ry);
      setRotZ(p.rz);
      setTransX(p.tx);
      setTransY(p.ty);

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [isDragging]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxTilt = 18;
    const rY = (mouseX / (rect.width / 2)) * maxTilt;
    const rX = -(mouseY / (rect.height / 2)) * maxTilt;
    const rZ = (mouseX / (rect.width / 2)) * 3;

    physicsRef.current.targetRx = rX;
    physicsRef.current.targetRy = rY;
    physicsRef.current.targetRz = rZ;
  };

  const handleMouseLeave = () => {
    if (isDragging) return;
    physicsRef.current.targetRx = 0;
    physicsRef.current.targetRy = 0;
    physicsRef.current.targetRz = 0;
    physicsRef.current.targetTx = 0;
    physicsRef.current.targetTy = 0;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    physicsRef.current.dragStartX = e.clientX - physicsRef.current.tx;
    physicsRef.current.dragStartY = e.clientY - physicsRef.current.ty;
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - physicsRef.current.dragStartX;
    const deltaY = e.clientY - physicsRef.current.dragStartY;

    physicsRef.current.tx = deltaX;
    physicsRef.current.ty = deltaY;
    physicsRef.current.rx = -deltaY * 0.15;
    physicsRef.current.ry = deltaX * 0.15;
    physicsRef.current.rz = deltaX * 0.08;
  };

  const handleGlobalMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    physicsRef.current.targetTx = 0;
    physicsRef.current.targetTy = 0;
    physicsRef.current.targetRx = 0;
    physicsRef.current.targetRy = 0;
    physicsRef.current.targetRz = 0;

    physicsRef.current.vtx = -physicsRef.current.tx * 0.2;
    physicsRef.current.vty = -physicsRef.current.ty * 0.2;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const sheenX = 50 + rotY * 2.5;
  const sheenY = 50 - rotX * 2.5;

  return (
    <div className="flex flex-col items-center justify-center relative perspective-1000 py-4 select-none">
      <div className="flex flex-col items-center relative z-20 pointer-events-none mb-[-12px]">
        <div
          className="w-12 h-14 border-x-4 border-t-4 border-cyan-500/80 rounded-t-full shadow-lg shadow-cyan-500/30 transition-transform duration-75"
          style={{
            transform: `rotate(${rotZ * 0.6}deg) translateX(${transX * 0.3}px)`,
          }}
        />
        <div className="w-6 h-5 bg-gradient-to-b from-slate-300 via-slate-100 to-slate-400 rounded-sm shadow border border-slate-400/50 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </div>
      </div>

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        style={{
          transform: `perspective(1000px) translate3d(${transX}px, ${transY}px, 0px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        className="relative group transition-shadow duration-300 rounded-3xl touch-none"
      >
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-30 opacity-30 group-hover:opacity-60 transition-opacity duration-300 overflow-hidden mix-blend-color-dodge"
          style={{
            background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.8) 0%, rgba(6,182,212,0.4) 30%, rgba(163,230,53,0.4) 60%, transparent 80%)`,
          }}
        />

        {children}
      </div>
    </div>
  );
};
