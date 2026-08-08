import React from 'react';
import type { BadgeData } from '../types';
import { FrontCardCanvas } from './FrontCardCanvas';

interface BuilderCardCanvasProps {
  badgeData: BadgeData;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const BuilderCardCanvas: React.FC<BuilderCardCanvasProps> = ({
  badgeData,
  onCanvasReady,
}) => {
  return <FrontCardCanvas badgeData={badgeData} onCanvasReady={onCanvasReady} />;
};
