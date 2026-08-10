export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

export async function waitForFonts(timeoutMs = 1200) {
  if (typeof document === 'undefined' || !document.fonts?.ready) return;
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, timeoutMs);
      }),
    ]);
  } catch {
    /* ignore */
  }
}

export function applyPhotoFilter(
  ctx: CanvasRenderingContext2D,
  filter: 'none' | 'vivid' | 'cyber' | 'vintage' | 'bw'
) {
  switch (filter) {
    case 'vivid':
      ctx.filter = 'contrast(118%) saturate(128%)';
      break;
    case 'cyber':
      ctx.filter = 'contrast(120%) saturate(90%) brightness(102%)';
      break;
    case 'vintage':
      ctx.filter = 'sepia(28%) contrast(108%) saturate(90%)';
      break;
    case 'bw':
      ctx.filter = 'grayscale(100%) contrast(122%)';
      break;
    default:
      ctx.filter = 'none';
  }
}

export function drawCoverPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  centerX: number,
  centerY: number,
  diameter: number,
  scale: number,
  offsetX: number,
  offsetY: number,
  rotation: number,
  filter: 'none' | 'vivid' | 'cyber' | 'vintage' | 'bw'
) {
  ctx.save();
  ctx.translate(centerX + offsetX, centerY + offsetY);
  ctx.rotate((rotation * Math.PI) / 180);
  applyPhotoFilter(ctx, filter);

  const imgRatio = img.naturalWidth / img.naturalHeight;
  let drawW = diameter * scale;
  let drawH = diameter * scale;
  if (imgRatio > 1) {
    drawW = diameter * imgRatio * scale;
  } else {
    drawH = (diameter / imgRatio) * scale;
  }
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}

export function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontWeight: number,
  maxPx: number,
  minPx: number,
  family: string
) {
  let size = maxPx;
  ctx.font = `${fontWeight} ${size}px ${family}`;
  while (size > minPx && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = `${fontWeight} ${size}px ${family}`;
  }
  return size;
}

export function sanitizeFilename(name: string) {
  const cleaned = (name || 'Attendee')
    .trim()
    .replace(/[^\w\s.-]+/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 48);
  return cleaned || 'Attendee';
}
