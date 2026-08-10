import { sanitizeFilename, fitText } from '../src/lib/images.ts';
import { FIELD_LIMITS, MAX_UPLOAD_BYTES } from '../src/lib/brand.ts';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(sanitizeFilename('') === 'Attendee', 'empty name');
assert(sanitizeFilename('   ') === 'Attendee', 'whitespace name');
assert(sanitizeFilename('Maya Lin') === 'Maya_Lin', 'spaces');
assert(!sanitizeFilename('A<>:"/\\|?*B').includes('<'), 'special chars');
assert(sanitizeFilename('x'.repeat(80)).length <= 48, 'long name');
assert(sanitizeFilename('Akira 🚀 Goa').includes('Akira'), 'emoji stripped but text kept');
assert(FIELD_LIMITS.name === 36, 'name limit');
assert(MAX_UPLOAD_BYTES === 12 * 1024 * 1024, 'upload cap');

const canvas = { measureText: (t) => ({ width: t.length * 20 }) };
const ctx = {
  font: '',
  measureText: canvas.measureText,
};
const size = fitText(ctx, 'VERYLONGNAMEWITHOUTSPACES', 200, 600, 40, 12, 'serif');
assert(size <= 40 && size >= 12, `fitText size ${size}`);
assert(ctx.font.includes('serif'), 'font assigned');

console.log('unit ok');
