import { BRAND } from './brand';

/** Draw the HH house-pass mark onto a canvas context. */
export function drawLogoMark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color = BRAND.brass
) {
  const s = size / 64;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(s, s);
  ctx.strokeStyle = color;
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';

  ctx.lineWidth = 2;
  roundRectPath(ctx, 11, 9, 42, 48, 7);
  ctx.stroke();

  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(32, 17.5, 3.2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 30.5);
  ctx.lineTo(32, 22.5);
  ctx.lineTo(44, 30.5);
  ctx.stroke();

  ctx.lineWidth = 2.15;
  ctx.beginPath();
  ctx.moveTo(23, 31.5);
  ctx.lineTo(23, 48);
  ctx.moveTo(23, 39.5);
  ctx.lineTo(30.5, 39.5);
  ctx.moveTo(30.5, 31.5);
  ctx.lineTo(30.5, 48);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(33.5, 31.5);
  ctx.lineTo(33.5, 48);
  ctx.moveTo(33.5, 39.5);
  ctx.lineTo(41, 39.5);
  ctx.moveTo(41, 31.5);
  ctx.lineTo(41, 48);
  ctx.stroke();

  ctx.restore();
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
