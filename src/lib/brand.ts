export const BRAND = {
  ink: '#0C0B09',
  inkSoft: '#161410',
  surface: '#1C1914',
  ivory: '#F3EDE3',
  stone: '#A8A093',
  brass: '#C4A46A',
  brassSoft: '#E4D2A8',
  laterite: '#B85C38',
  palm: '#6A7A62',
} as const;

export const FIELD_LIMITS = {
  name: 36,
  role: 22,
  team: 22,
  badgeId: 18,
} as const;

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/heic',
  'image/heif',
];
