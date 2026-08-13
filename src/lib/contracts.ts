import { z } from 'zod';

/**
 * ------------------------------------------------------------------
 * 1. CONTRACT-FIRST API SCHEMAS & VALIDATION (Zod)
 * ------------------------------------------------------------------
 */

export const BadgeDataSchema = z.object({
  name: z.string().min(1).max(36),
  role: z.string().min(1).max(22),
  team: z.string().min(1).max(22),
  builderTitle: z.string().max(32).optional(),
  badgeId: z.string().min(1).max(18),
  photoUrl: z.string().nullable(),
  cardBgTheme: z.enum(['cyber', 'sunset', 'emerald', 'midnight', 'gold']),
  customBgUrl: z.string().nullable().optional(),
  scale: z.number().min(0.5).max(3),
  offsetX: z.number().min(-250).max(250),
  offsetY: z.number().min(-250).max(250),
  rotation: z.number().min(-180).max(180),
  filter: z.enum(['none', 'vivid', 'cyber', 'vintage', 'bw']),
});

export const CsvRecordSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  team: z.string().optional(),
  builderTitle: z.string().optional(),
  badgeId: z.string().optional(),
  photoUrl: z.string().optional(),
  cardBgTheme: z.enum(['cyber', 'sunset', 'emerald', 'midnight', 'gold']).optional(),
});

export type ValidatedBadgeData = z.infer<typeof BadgeDataSchema>;
export type ValidatedCsvRecord = z.infer<typeof CsvRecordSchema>;

/**
 * ------------------------------------------------------------------
 * 2. RFC 7807 PROBLEM DETAILS ERROR CONTRACT
 * ------------------------------------------------------------------
 */

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
  invalidParams?: Array<{ name: string; reason: string }>;
}

export function createProblemDetails(
  status: number,
  title: string,
  detail: string,
  instance: string,
  invalidParams?: Array<{ name: string; reason: string }>
): ProblemDetails {
  return {
    type: `https://hackerhousegoa.com/errors/${status}`,
    title,
    status,
    detail,
    instance,
    timestamp: new Date().toISOString(),
    invalidParams,
  };
}

/**
 * ------------------------------------------------------------------
 * 3. STRUCTURED NDJSON TELEMETRY LOGGER
 * ------------------------------------------------------------------
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'metric';

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  subsystem: string;
  event: string;
  payload: Record<string, unknown>;
}

class TelemetryLogger {
  private logs: StructuredLog[] = [];

  public log(level: LogLevel, subsystem: string, event: string, payload: Record<string, unknown> = {}) {
    const entry: StructuredLog = {
      timestamp: new Date().toISOString(),
      level,
      subsystem,
      event,
      payload,
    };

    this.logs.push(entry);
    if (this.logs.length > 300) {
      this.logs.shift();
    }

    const ndjson = JSON.stringify(entry);
    if (level === 'error') {
      console.error(`[NDJSON] ${ndjson}`);
    } else if (level === 'warn') {
      console.warn(`[NDJSON] ${ndjson}`);
    } else {
      console.log(`[NDJSON] ${ndjson}`);
    }
  }

  public getRecentNDJSON(count = 20): string {
    return this.logs
      .slice(-count)
      .map((l) => JSON.stringify(l))
      .join('\n');
  }
}

export const logger = new TelemetryLogger();

/**
 * ------------------------------------------------------------------
 * 4. SANITIZATION & RATE-LIMITING UTILITIES
 * ------------------------------------------------------------------
 */

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 100);
}

const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(key: string, limit = 15, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    logger.log('warn', 'Security', 'RateLimitExceeded', { key, limit, windowMs });
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(key, validTimestamps);
  return true;
}
