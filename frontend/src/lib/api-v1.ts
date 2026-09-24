// Shared helpers for /api/v1/*. Provides:
//   - API key authentication via Authorization: Bearer <secret>
//   - minute-window rate limit (DB-backed, optional in-memory fast path)
//   - CORS headers so the API can be consumed by other frontends
//   - standard JSON envelope { ok, data, error }
//
// We deliberately do NOT introduce a JWT / OAuth dependency for v1;
// SHA-256 hashed static keys are sufficient until a real customer
// portal ships.

import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { DatabaseNotConfiguredError, getPool } from "@/server/db";

export const dynamic = "force-dynamic";

export interface ApiKeyRow {
  id: string;
  owner_label: string;
  key_hash: string;
  scopes: string;
  rate_limit: number;
  monthly_quota: number;
  calls_this_month: number;
  status: string;
}

export interface AuthSuccess {
  ok: true;
  key: ApiKeyRow;
}

export interface AuthFailure {
  ok: false;
  response: NextResponse;
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function applyCors(response: NextResponse): NextResponse {
  // Public data API — allow any origin but keep responses cacheable.
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export function ok<T>(data: T, init: ResponseInit = {}): NextResponse {
  return applyCors(
    NextResponse.json({ ok: true, data }, { status: 200, ...init }),
  );
}

export function fail(code: string, message: string, status: number): NextResponse {
  return applyCors(
    NextResponse.json({ ok: false, error: { code, message } }, { status }),
  );
}

export async function handleOptions(): Promise<NextResponse> {
  return applyCors(new NextResponse(null, { status: 204 }));
}

function extractBearer(req: Request): string | null {
  const header = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!header) return null;
  const trimmed = header.trim();
  if (trimmed.toLowerCase().startsWith("bearer ")) return trimmed.slice(7).trim();
  // Allow X-API-Key header as a friendlier alternative.
  const alt = req.headers.get("x-api-key") ?? req.headers.get("X-Api-Key");
  return alt ? alt.trim() : null;
}

export async function authenticate(req: Request): Promise<AuthSuccess | AuthFailure> {
  const secret = extractBearer(req);
  if (!secret) {
    return { ok: false, response: fail("MISSING_API_KEY", "Provide Authorization: Bearer <key> or X-Api-Key header.", 401) };
  }
  if (secret.length < 16 || secret.length > 256) {
    return { ok: false, response: fail("INVALID_API_KEY", "API key has unexpected length.", 401) };
  }
  const hash = sha256(secret);
  try {
    const r = await getPool().query<ApiKeyRow>(
      `SELECT id, owner_label, key_hash, scopes, rate_limit, monthly_quota,
              calls_this_month, status
       FROM api_keys WHERE key_hash = $1 LIMIT 1`,
      [hash],
    );
    const row = r.rows[0];
    if (!row) {
      return { ok: false, response: fail("INVALID_API_KEY", "API key is not recognized.", 401) };
    }
    if (row.status !== "active") {
      return { ok: false, response: fail("API_KEY_REVOKED", "API key has been revoked.", 403) };
    }
    if (row.calls_this_month >= row.monthly_quota) {
      return { ok: false, response: fail("QUOTA_EXHAUSTED", "Monthly quota exhausted.", 429) };
    }
    return { ok: true, key: row };
  } catch (e) {
    if (e instanceof DatabaseNotConfiguredError) {
      return { ok: false, response: fail(e.code, e.message, e.status) };
    }
    console.error("[v1] auth error:", e);
    return { ok: false, response: fail("DB_UNREACHABLE", e instanceof Error ? e.message : String(e), 503) };
  }
}

// Coarse minute-window rate limit. Per-key, in-memory + DB-backed.
// Returns true if the request is allowed; false if rate-limited.
export async function checkRateLimit(keyId: string, perMinute: number): Promise<{ allowed: boolean; remaining: number }> {
  // In-memory fast path.
  const now = new Date();
  const minute = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}${String(now.getUTCHours()).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}`;
  const bucketKey = `apikey:${keyId}:${minute}`;

  try {
    const result = await getPool().query<{ hits: number; window_start: Date | string }>(
      `INSERT INTO rate_limit_buckets (bucket_key, hits, window_start)
       VALUES ($1, 1, NOW())
       ON CONFLICT (bucket_key) DO UPDATE
         SET hits = rate_limit_buckets.hits + 1
       RETURNING hits, window_start`,
      [bucketKey],
    );
    const hits = result.rows[0]?.hits ?? 0;
    const remaining = Math.max(0, perMinute - hits);
    return { allowed: hits <= perMinute, remaining };
  } catch (e) {
    // Never block traffic because the rate limit store is down.
    console.error("[v1] rate-limit error:", e);
    return { allowed: true, remaining: perMinute };
  }
}

// Increment the persistent monthly counter. Fire-and-forget — never
// throw to the caller.
export async function bumpMonthlyUsage(keyId: string): Promise<void> {
  try {
    await getPool().query(
      `UPDATE api_keys
         SET calls_this_month = calls_this_month + 1,
             last_used_at = NOW()
       WHERE id = $1`,
      [keyId],
    );
  } catch (e) {
    console.error("[v1] bump usage error:", e);
  }
}

// Helper to enforce a scope. Returns null on success, or a NextResponse
// on failure.
export function requireScope(key: ApiKeyRow, scope: string): NextResponse | null {
  const scopes = key.scopes.split(",").map((s) => s.trim());
  if (!scopes.includes(scope) && !scopes.includes("*")) {
    return fail("INSUFFICIENT_SCOPE", `API key is missing required scope: ${scope}`, 403);
  }
  return null;
}