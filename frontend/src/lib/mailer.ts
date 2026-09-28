// Tiny mailer abstraction. The default ConsoleMailer writes the
// rendered message to stdout, which is exactly what tests and local
// development need; a real SMTP / Resend implementation can be
// dropped in without changing call sites by selecting on env at
// module load.
//
// Why a thin abstraction: every external side effect (network,
// delivery receipts, retries) belongs behind an interface so a
// failing transport cannot silently drop a magic-link email.

export interface Mailer {
  send(args: { to: string; subject: string; text: string; html?: string }): Promise<void>;
}

export class ConsoleMailer implements Mailer {
  async send({ to, subject, text }: { to: string; subject: string; text: string; html?: string }): Promise<void> {
    // Prefix keeps the line greppable in dev logs and CI output.
    console.log(`[mail] to=${to} subject="${subject}"\n${text}`);
  }
}

let cached: Mailer | null = null;

export function getMailer(): Mailer {
  if (cached) return cached;
  // A real Resend client would be chosen here when RESEND_API_KEY is
  // set. Until then we deliberately fall back to the console sink
  // rather than crashing the request, so a missing mail config never
  // blocks sign-in.
  cached = new ConsoleMailer();
  return cached;
}

// Test-only hook to clear the cached instance.
export function __resetMailerForTests(): void {
  cached = null;
}
