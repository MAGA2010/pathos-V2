// GET /api/v1/universities/[id]
// Returns a single university plus its full detail JSONB blob.
// Authenticated via API key (scope: universities.read).

import { NextResponse } from "next/server";
import { DatabaseNotConfiguredError, getPool } from "@/server/db";
import {
  authenticate, bumpMonthlyUsage, checkRateLimit, requireScope,
  handleOptions, ok, fail,
} from "@/lib/api-v1";

export const dynamic = "force-dynamic";
export { handleOptions as OPTIONS };

interface UniversityRow {
  id: string;
  name: string;
  chinese_name: string | null;
  city: string | null;
  state: string | null;
  region: string | null;
  school_type: string | null;
  ranking_band: string | null;
  ranking_tier: string | null;
  national_ranking: number | null;
  latitude: number | null;
  longitude: number | null;
  preview_only: boolean;
  updated_at: Date | string;
  payload: unknown;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const auth = await authenticate(req);
  if (!auth.ok) return auth.response;
  const scopeErr = requireScope(auth.key, "universities.read");
  if (scopeErr) return scopeErr;

  const rl = await checkRateLimit(auth.key.id, auth.key.rate_limit);
  if (!rl.allowed) return fail("RATE_LIMITED", "Too many requests. Try again in a minute.", 429);

  const rawId = (params.id ?? "").trim();
  if (!rawId) return fail("INVALID_ID", "University id is required", 400);
  let id: string;
  try { id = decodeURIComponent(rawId); }
  catch { return fail("INVALID_ID", "University id has invalid percent-encoding", 400); }
  if (id.length > 256) return fail("INVALID_ID", "University id is too long", 400);

  try {
    const r = await getPool().query<UniversityRow>(
      `SELECT u.id, u.name, u.chinese_name, u.city, u.state, u.region,
              u.school_type, u.ranking_band, u.ranking_tier, u.national_ranking,
              u.latitude, u.longitude, u.preview_only, u.updated_at,
              d.payload
        FROM universities u
        LEFT JOIN university_details d ON d.university_id = u.id
        WHERE u.id = $1
        LIMIT 1`,
      [id],
    );
    const row = r.rows[0];
    if (!row) return fail("NOT_FOUND", `University not found: ${id}`, 404);

    void bumpMonthlyUsage(auth.key.id);

    return ok({
      id: row.id,
      name: row.name,
      chineseName: row.chinese_name,
      city: row.city,
      state: row.state,
      region: row.region,
      schoolType: row.school_type,
      rankingBand: row.ranking_band,
      rankingTier: row.ranking_tier,
      nationalRanking: row.national_ranking,
      latitude: row.latitude,
      longitude: row.longitude,
      previewOnly: row.preview_only,
      updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
      detail: row.payload ?? null,
      rateLimit: { remaining: rl.remaining, perMinute: auth.key.rate_limit },
      quota: { used: auth.key.calls_this_month, limit: auth.key.monthly_quota },
    });
  } catch (e) {
    if (e instanceof DatabaseNotConfiguredError) {
      return fail(e.code, e.message, e.status);
    }
    console.error("[v1/universities/:id] error:", e);
    return fail("DB_UNREACHABLE", e instanceof Error ? e.message : String(e), 503);
  }
}