// POST /api/reports/generate
// Body: { profile: StudentProfile, schools: UniversityRef[],
//         leadId?: string, plan?: 'single_report' | 'advisor_annual' }
// Response: { id, status, payload? }
//
// Internally fans out to /api/ai/analyze so we never duplicate the
// scoring logic. Persists the result into the reports table so it
// can be re-shown via /reports/[id] without paying for a new LLM call.

import { NextResponse } from "next/server";
import { DatabaseNotConfiguredError, getPool } from "@/server/db";

export const dynamic = "force-dynamic";

interface GenerateRequest {
  profile?: Record<string, unknown>;
  schools?: Array<{ id?: string; name?: string; chineseName?: string }>;
  leadId?: string;
  plan?: string;
  notes?: string;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

function asObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, max = 500): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : undefined;
}

function newId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `rpt_${t}_${r}`;
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: GenerateRequest;
  try { body = (await req.json()) as GenerateRequest; }
  catch { return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 }); }

  const profile = asObject(body.profile);
  const schools = asArray<Record<string, unknown>>(body.schools).map((s) => ({
    id: asString(s.id),
    name: asString(s.name),
    chineseName: asString(s.chineseName),
  }));
  const plan = asString(body.plan, 32) ?? "single_report";
  const notes = asString(body.notes, 1000);

  if (schools.length === 0) {
    return NextResponse.json(
      { ok: false, code: "MISSING_SCHOOLS", message: "At least one school is required." },
      { status: 400 },
    );
  }
  if (!profile || Object.keys(profile).length === 0) {
    return NextResponse.json(
      { ok: false, code: "MISSING_PROFILE", message: "Profile is required." },
      { status: 400 },
    );
  }

  const id = newId();

  // Persist the report row immediately (status=pending) so we never
  // lose the request if the upstream AI call later throws.
  try {
    await getPool().query(
      `INSERT INTO reports (id, plan, profile, schools, status)
       VALUES ($1, $2, $3::jsonb, $4::jsonb, 'pending')`,
      [id, plan, JSON.stringify(profile), JSON.stringify(schools)],
    );
  } catch (e) {
    if (e instanceof DatabaseNotConfiguredError) {
      return NextResponse.json({ ok: false, code: e.code, message: e.message }, { status: e.status });
    }
    console.error("[reports/generate] insert failed:", e);
    return NextResponse.json(
      { ok: false, code: "DB_UNREACHABLE", message: e instanceof Error ? e.message : String(e) },
      { status: 503 },
    );
  }

  // Fan out to /api/ai/analyze using the same-origin URL. We pass
  // 'school_assessment' as the mode; this reuses the deterministic
  // scoring + DeepSeek layer without duplicating any logic.
  let aiResult: unknown = null;
  let aiError: string | null = null;
  try {
    const origin = new URL(req.url).origin;
    const aiResp = await fetch(`${origin}/api/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "school_assessment",
        profile,
        schools,
        notes,
      }),
    });
    if (aiResp.ok) {
      aiResult = await aiResp.json();
    } else {
      const text = await aiResp.text().catch(() => "");
      aiError = `AI returned ${aiResp.status}: ${text.slice(0, 200)}`;
    }
  } catch (e) {
    aiError = e instanceof Error ? e.message : String(e);
  }

  const status = aiResult ? "ready" : "failed";
  const error = aiError;

  try {
    await getPool().query(
      `UPDATE reports
         SET status = $2, payload = $3::jsonb, error = $4, updated_at = NOW()
       WHERE id = $1`,
      [id, status, JSON.stringify(aiResult ?? {}), error],
    );
  } catch (e) {
    console.error("[reports/generate] update failed:", e);
    // We still return what we have -- the row exists in the DB; the
    // client can re-read it after we recover from the transient error.
  }

  return NextResponse.json({ ok: aiResult != null, id, status, error }, { status: aiResult ? 200 : 502 });
}