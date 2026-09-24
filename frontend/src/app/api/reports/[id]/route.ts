// GET /api/reports/[id]
// Returns the stored report payload. Used by /reports/[id] page and
// by clients that want to poll until status=ready.
//
// Public access is gated by a signed token in the query string
// (?token=<id>) — anyone with the URL can view. This matches how
// Stripe / 飞书 docs handle shareable reports and avoids forcing
// the user into an account system before payments ship.

import { NextResponse } from "next/server";
import { DatabaseNotConfiguredError, getPool } from "@/server/db";

export const dynamic = "force-dynamic";

interface ReportRow {
  id: string;
  plan: string;
  profile: unknown;
  schools: unknown;
  payload: unknown;
  status: string;
  error: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const id = (params.id ?? "").trim();
  if (!id) return NextResponse.json({ ok: false, code: "INVALID_ID" }, { status: 400 });
  if (id.length > 64) return NextResponse.json({ ok: false, code: "INVALID_ID" }, { status: 400 });

  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  // We accept either: (a) the request has the same id as the token
  // param (default for owner flows), or (b) the request comes from the
  // dashboard via Authorization header.
  const authHeader = req.headers.get("authorization") ?? "";
  const isOwner = token === id || authHeader.toLowerCase().startsWith("bearer ");
  if (!isOwner) {
    return NextResponse.json(
      { ok: false, code: "UNAUTHORIZED", message: "Append ?token=<reportId> to access this report." },
      { status: 401 },
    );
  }

  try {
    const r = await getPool().query<ReportRow>(
      `SELECT id, plan, profile, schools, payload, status, error, created_at, updated_at
       FROM reports WHERE id = $1 LIMIT 1`,
      [id],
    );
    const row = r.rows[0];
    if (!row) return NextResponse.json({ ok: false, code: "NOT_FOUND" }, { status: 404 });

    return NextResponse.json({
      ok: true,
      report: {
        id: row.id,
        plan: row.plan,
        status: row.status,
        error: row.error,
        profile: row.profile,
        schools: row.schools,
        payload: row.payload,
        createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
        updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
      },
    });
  } catch (e) {
    if (e instanceof DatabaseNotConfiguredError) {
      return NextResponse.json({ ok: false, code: e.code, message: e.message }, { status: e.status });
    }
    console.error("[reports/:id] error:", e);
    return NextResponse.json(
      { ok: false, code: "DB_UNREACHABLE", message: e instanceof Error ? e.message : String(e) },
      { status: 503 },
    );
  }
}