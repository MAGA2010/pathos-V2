// GET /api/auth/callback?token=...
//
// This is the URL the user lands on after clicking the email link.
// Three steps run in order:
//   1. Validate the token shape and consume it (single-use, atomic).
//      consumeMagicLink also upserts the user row, so the first-ever
//      sign-in for an address materializes a `free` account here.
//   2. Create a cookie session backed by a random id; the database
//      stores only the SHA-256.
//   3. 302 to /s/home on success, or /login?error=... on failure.
//      The error code is generic enough not to leak whether the token
//      was simply missing vs expired vs already used.
//
// We deliberately do not use a server action here: clicking a link in
// mail has to work with cookies disabled / from a different device,
// and a 302 is the only portable way to land the user on a logged-in
// page.
import { NextResponse } from "next/server";
import { DatabaseNotConfiguredError } from "@/server/db";
import { SESSION_COOKIE, createSession } from "@/lib/session";
import { consumeMagicLink } from "@/lib/auth-magic-link";
import { hashIp } from "@/lib/report-access";

export const dynamic = "force-dynamic";

const SESSION_TTL_MS = Number(process.env.PATHOS_SESSION_TTL_DAYS ?? 30) * 24 * 60 * 60 * 1000;

function fail(req: Request, code: string): NextResponse {
  const dest = new URL("/login", new URL(req.url).origin);
  dest.searchParams.set("error", code);
  return NextResponse.redirect(dest, { status: 302 });
}

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  // 32-byte base64url tokens are 43 chars. Anything else is junk and we
  // bail before touching the DB.
  if (!token || token.length < 40 || token.length > 64 || !/^[A-Za-z0-9_-]+$/.test(token)) {
    return fail(req, "invalid");
  }

  let user: { userId: string; email: string; displayName: string | null; tier: "free" | "pro" | "studio"; isNewUser: boolean };
  try {
    const result = await consumeMagicLink(token);
    if (!result) return fail(req, "invalid");
    user = result;
  } catch (e) {
    if (e instanceof DatabaseNotConfiguredError) {
      return fail(req, "unavailable");
    }
    console.error("[auth] consume failed:", e);
    return fail(req, "invalid");
  }

  let sid: string;
  let expiresAt: Date;
  try {
    const sess = await createSession({
      userId: user.userId,
      ipHash: hashIp(req),
      userAgent: req.headers.get("user-agent"),
    });
    sid = sess.id;
    expiresAt = sess.expiresAt;
  } catch (e) {
    console.error("[auth] session create failed:", e);
    return fail(req, "invalid");
  }

  const isHttps = url.protocol === "https:";
  const cookieValue = [
    `${SESSION_COOKIE}=${sid}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Expires=${expiresAt.toUTCString()}`,
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ];
  if (isHttps) cookieValue.push("Secure");

  // /s/home already exists in the old PathOS and acts as the data
  // workbench. We append `welcome=new` for first-time sign-ins so the
  // page can surface a "you're in" toast without a separate route.
  const dest = new URL("/s/home", url.origin);
  dest.searchParams.set("welcome", user.isNewUser ? "new" : "back");
  const response = NextResponse.redirect(dest, { status: 302 });
  response.headers.append("Set-Cookie", cookieValue.join("; "));
  return response;
}
