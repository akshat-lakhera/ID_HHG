import { useEffect, useRef, useState } from 'react';

interface PhysicsLanyardCardProps {
  children: React.ReactNode;
}

export function PhysicsLanyardCard({ children }: PhysicsLanyardCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);
  const [transX, setTransX] = useState(0);
  const [transY, setTransY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const physicsRef = useRef({
    rx: 0,
    ry: 0,
    rz: 0,
    tx: 0,
    ty: 0,
    targetRx: 0,
    targetRy: 0,
    targetRz: 0,
    targetTx: 0,
    targetTy: 0,
    vrx: 0,
    vry: 0,
    vrz: 0,
    vtx: 0,
    vty: 0,
    dragStartX: 0,
    dragStartY: 0,
  });

  const stiffness = 0.08;
  const damping = 0.78;
  const mass = 1.2;

  useEffect(() => {
    let animId = 0;
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

  const handlePointerMoveHover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging || e.pointerType === 'touch') return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);
    const maxTilt = 12;
    physicsRef.current.targetRy = (mouseX / (rect.width / 2)) * maxTilt;
    physicsRef.current.targetRx = -(mouseY / (rect.height / 2)) * maxTilt;
    physicsRef.current.targetRz = (mouseX / (rect.width / 2)) * 2;
  };

  const handlePointerLeave = () => {
    if (isDragging) return;
    const p = physicsRef.current;
    p.targetRx = 0;
    p.targetRy = 0;
    p.targetRz = 0;
    p.targetTx = 0;
    p.targetTy = 0;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    physicsRef.current.dragStartX = e.clientX - physicsRef.current.tx;
    physicsRef.current.dragStartY = e.clientY - physicsRef.current.ty;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => {
      const p = physicsRef.current;
      const deltaX = e.clientX - p.dragStartX;
      const deltaY = e.clientY - p.dragStartY;
      p.tx = deltaX;
      p.ty = deltaY;
      p.rx = -deltaY * 0.12;
      p.ry = deltaX * 0.12;
      p.rz = deltaX * 0.06;
    };
    const onUp = () => {
      setIsDragging(false);
      const p = physicsRef.current;
      p.targetTx = 0;
      p.targetTy = 0;
      p.targetRx = 0;
      p.targetRy = 0;
      p.targetRz = 0;
      p.vtx = -p.tx * 0.18;
      p.vty = -p.ty * 0.18;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [isDragging]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-3 [perspective:1100px]">
      <div className="relative z-20 mb-[-10px] flex flex-col items-center pointer-events-none">
        <div
          className="h-12 w-10 rounded-t-full border-x-[3px] border-t-[3px] border-[var(--brass)]/55"
          style={{ transform: `rotate(${rotZ * 0.55}deg) translateX(${transX * 0.28}px)` }}
        />
        <div className="grid h-4 w-5 place-items-center rounded-[3px] border border-[var(--brass)]/40 bg-gradient-to-b from-[#e8dcc4] to-[#b4965e]">
          <div className="size-1.5 rounded-full bg-[var(--ink)]" />
        </div>
      </div>

      <div
        ref={cardRef}
        onPointerMove={handlePointerMoveHover}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        style={{
          transform: `perspective(1100px) translate3d(${transX}px, ${transY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        className="relative touch-none"
      >
        {children}
      </div>
    </div>
  );
}
