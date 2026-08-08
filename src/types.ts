export type FormatType = 'card' | 'pfp' | 'both';
export type CardSide = 'front' | 'back' | 'both';
export type CardBgTheme = 'cyber' | 'sunset' | 'emerald' | 'midnight' | 'gold';

export interface BadgeData {
  name: string;
  role: string;
  team: string;
  badgeId: string;
  photoUrl: string | null;
  cardBgTheme: CardBgTheme;
  customBgUrl?: string | null;
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  filter: 'none' | 'vivid' | 'cyber' | 'vintage' | 'bw';
}

export interface CsvRecord {
  name: string;
  role?: string;
  team?: string;
  badgeId?: string;
  photoUrl?: string;
  cardBgTheme?: CardBgTheme;
}
