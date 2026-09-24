import { NextResponse } from "next/server";
import { DatabaseNotConfiguredError, getPool } from "@/server/db";

export const dynamic = "force-dynamic";

function resolveMode(): string {
  const raw = process.env.PATHOS_DATA_MODE?.trim();
  if (raw) return raw;
  // Default: when PATHOS_DATA_MODE is unset, treat the deployment as
  // the backend BFF (matching resolveDataMode() in pathos-preview.ts).
  // This removes the historical "mode: unknown" from /api/health.
  return "backend";
}

export async function GET(): Promise<NextResponse> {
  try {
    const pool = getPool();
    const uniCount = await pool.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM universities",
    );
    const detailCount = await pool.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM university_details",
    );
    const manifestRow = await pool.query<{ updated_at: string }>(
      "SELECT updated_at FROM manifest WHERE id = 1",
    );
    return NextResponse.json({
      ok: true,
      mode: resolveMode(),
      universities: uniCount.rows[0]?.n ?? 0,
      universityDetails: detailCount.rows[0]?.n ?? 0,
      manifestUpdatedAt: manifestRow.rows[0]?.updated_at ?? null,
      nodeEnv: process.env.NODE_ENV ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    if (e instanceof DatabaseNotConfiguredError) {
      return NextResponse.json(
        { ok: false, code: e.code, message: e.message },
        { status: e.status },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        code: "DB_UNREACHABLE",
        message: e instanceof Error ? e.message : String(e),
      },
      { status: 503 },
    );
  }
}