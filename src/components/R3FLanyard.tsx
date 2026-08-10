import * as THREE from 'three';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import type { BadgeData } from '../types';

interface R3FLanyardProps {
  badgeData: BadgeData;
  frontCanvas: HTMLCanvasElement | null;
  backCanvas: HTMLCanvasElement | null;
}

function LanyardPhysicsCard({
  frontCanvas,
  backCanvas,
  badgeData,
}: {
  frontCanvas: HTMLCanvasElement | null;
  backCanvas: HTMLCanvasElement | null;
  badgeData: BadgeData;
}) {
  const cardGroupRef = useRef<THREE.Group>(null!);

  const [frontTexture, setFrontTexture] = useState<THREE.CanvasTexture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.CanvasTexture | null>(null);

  // Fallback internal canvas if parent ref is null
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasToUse = frontCanvas || internalCanvasRef.current;
    if (canvasToUse) {
      const tex = new THREE.CanvasTexture(canvasToUse);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      setFrontTexture(tex);
    }
  }, [
    frontCanvas,
    badgeData,
    badgeData.customBgUrl,
    badgeData.filter,
    badgeData.photoUrl,
    badgeData.name,
    badgeData.role,
    badgeData.team,
    badgeData.badgeId,
    badgeData.scale,
    badgeData.offsetX,
    badgeData.offsetY,
    badgeData.rotation,
  ]);

  useEffect(() => {
    if (backCanvas) {
      const tex = new THREE.CanvasTexture(backCanvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      setBackTexture(tex);
    }
  }, [backCanvas]);

  // Continuously check and sync texture
  useFrame(() => {
    const targetCanvas = frontCanvas || internalCanvasRef.current;
    if (targetCanvas) {
      if (!frontTexture) {
        const tex = new THREE.CanvasTexture(targetCanvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        setFrontTexture(tex);
      } else {
        frontTexture.needsUpdate = true;
      }
    }
  });

  const state = useRef({
    x: 0,
    y: -1.2,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,

    rotX: 0,
    rotY: 0,
    rotZ: 0,
    vRotX: 0,
    vRotY: 0,
    vRotZ: 0,

    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    lastX: 0,
    lastY: 0,
    dragVelX: 0,
    dragVelY: 0,

    idleTimer: 0,
  });

  const topAnchor = new THREE.Vector3(0, 3.8, 0);

  const [linePoints, setLinePoints] = useState<THREE.Vector3[]>([
    topAnchor,
    new THREE.Vector3(0, 2.5, 0.1),
    new THREE.Vector3(0, 1.2, 0.1),
    new THREE.Vector3(0, 0.6, 0),
  ]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const s = state.current;
    s.isDragging = true;
    s.lastX = e.point.x;
    s.lastY = e.point.y;
    s.dragVelX = 0;
    s.dragVelY = 0;
  };

  const handlePointerMove = (e: any) => {
    const s = state.current;
    if (!s.isDragging) return;

    s.dragVelX = e.point.x - s.lastX;
    s.dragVelY = e.point.y - s.lastY;
    s.lastX = e.point.x;
    s.lastY = e.point.y;

    s.x = e.point.x;
    s.y = e.point.y;

    s.rotZ = -s.dragVelX * 2.2;
    s.rotX = s.dragVelY * 2.2;
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    const s = state.current;
    if (!s.isDragging) return;
    s.isDragging = false;

    s.vx = s.dragVelX * 22;
    s.vy = s.dragVelY * 22;
    s.vRotZ = -s.dragVelX * 30;
    s.vRotY = s.dragVelX * 35;
    s.vRotX = s.dragVelY * 25;
  };

  useFrame((_, delta) => {
    const s = state.current;
    const dt = Math.min(delta, 0.05);

    if (!s.isDragging) {
      const restX = 0;
      const restY = -1.2;
      const restZ = 0;

      const k = 42.0;
      const c = 4.2;

      const ax = -k * (s.x - restX) - c * s.vx;
      const ay = -k * (s.y - restY) - c * s.vy;
      const az = -k * (s.z - restZ) - c * s.vz;

      s.vx += ax * dt;
      s.vy += ay * dt;
      s.vz += az * dt;

      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.z += s.vz * dt;

      const kRot = 32.0;
      const cRot = 3.6;

      const targetRotZ = -(s.x - restX) * 0.7;
      const targetRotX = (s.y - restY) * 0.4;

      const aRotX = -kRot * (s.rotX - targetRotX) - cRot * s.vRotX;
      const aRotY = -kRot * s.rotY - cRot * s.vRotY;
      const aRotZ = -kRot * (s.rotZ - targetRotZ) - cRot * s.vRotZ;

      s.vRotX += aRotX * dt;
      s.vRotY += aRotY * dt;
      s.vRotZ += aRotZ * dt;

      s.rotX += s.vRotX * dt;
      s.rotY += s.vRotY * dt;
      s.rotZ += s.vRotZ * dt;

      s.idleTimer += dt * 1.8;
      if (Math.abs(s.vx) < 0.03 && Math.abs(s.vy) < 0.03) {
        s.rotY += Math.sin(s.idleTimer) * 0.003;
        s.rotZ += Math.cos(s.idleTimer * 0.7) * 0.002;
      }
    }

    if (cardGroupRef.current) {
      cardGroupRef.current.position.set(s.x, s.y, s.z);
      cardGroupRef.current.rotation.set(s.rotX, s.rotY, s.rotZ);
    }

    const cardMatrix = cardGroupRef.current ? cardGroupRef.current.matrixWorld : new THREE.Matrix4();
    const localClipTop = new THREE.Vector3(0, 1.8, 0);
    const cardTopWorld = localClipTop.applyMatrix4(cardMatrix);

    const mid1 = new THREE.Vector3(
      topAnchor.x * 0.75 + cardTopWorld.x * 0.25,
      topAnchor.y * 0.7 + cardTopWorld.y * 0.3,
      (topAnchor.z + cardTopWorld.z) * 0.5 + 0.15
    );

    const mid2 = new THREE.Vector3(
      topAnchor.x * 0.25 + cardTopWorld.x * 0.75,
      topAnchor.y * 0.35 + cardTopWorld.y * 0.65,
      cardTopWorld.z * 0.8 + 0.1
    );

    const curve = new THREE.CatmullRomCurve3([topAnchor, mid1, mid2, cardTopWorld]);
    const pts = curve.getPoints(36);
    setLinePoints(pts);
  });

  return (
    <>
      <mesh position={[0, 3.8, 0]}>
        <torusGeometry args={[0.22, 0.05, 16, 32]} />
        <meshStandardMaterial color="#C4A46A" metalness={0.85} roughness={0.28} />
      </mesh>

      <Line
        points={linePoints}
        color="#8A7348"
        lineWidth={6}
      />

      <group
        ref={cardGroupRef}
        position={[0, -1.2, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[0.24, 0.2, 0.08]} />
          <meshStandardMaterial color="#E4D2A8" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.92, 0]}>
          <torusGeometry args={[0.12, 0.03, 16, 32]} />
          <meshStandardMaterial color="#C4A46A" metalness={0.75} roughness={0.3} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.3, 3.6, 0.04]} />

          <meshPhysicalMaterial attach="material-0" color="#0C0B09" roughness={0.35} metalness={0.35} />
          <meshPhysicalMaterial attach="material-1" color="#0C0B09" roughness={0.35} metalness={0.35} />

          <meshPhysicalMaterial
            attach="material-2"
            color="#B85C38"
            roughness={0.35}
            metalness={0.25}
          />

          <meshPhysicalMaterial attach="material-3" color="#0C0B09" roughness={0.35} metalness={0.35} />

          <meshPhysicalMaterial
            attach="material-4"
            map={frontTexture || undefined}
            color={frontTexture ? '#ffffff' : '#0C0B09'}
            clearcoat={0.25}
            clearcoatRoughness={0.4}
            roughness={0.35}
            metalness={0.08}
          />

          <meshPhysicalMaterial
            attach="material-5"
            map={backTexture || undefined}
            color={backTexture ? '#ffffff' : '#0C0B09'}
            clearcoat={0.25}
            clearcoatRoughness={0.4}
            roughness={0.35}
            metalness={0.08}
          />
        </mesh>
      </group>
    </>
  );
}

export const R3FLanyard: React.FC<R3FLanyardProps> = ({
  badgeData,
  frontCanvas,
  backCanvas,
}) => {
  return (
    <div className="relative h-[420px] w-full cursor-grab overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--ink-2)] select-none active:cursor-grabbing sm:h-[540px]">
      <Canvas camera={{ position: [0, 0, 9.5], fov: 32 }} dpr={[1, 2]}>
        <ambientLight intensity={1.4} />
        <directionalLight position={[10, 10, 12]} intensity={1.6} />
        <directionalLight position={[-8, -6, -8]} intensity={0.45} color="#C4A46A" />
        <pointLight position={[0, -2, 4]} intensity={0.45} color="#E4D2A8" />

        <LanyardPhysicsCard
          badgeData={badgeData}
          frontCanvas={frontCanvas}
          backCanvas={backCanvas}
        />
      </Canvas>
    </div>
  );
};
