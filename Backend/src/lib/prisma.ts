import { PrismaClient } from '@prisma/client';

function assertDatabaseEnv(): void {
  const missing: string[] = [];
  if (!process.env.DATABASE_URL?.trim()) missing.push('DATABASE_URL');
  if (!process.env.DIRECT_URL?.trim()) missing.push('DIRECT_URL');
  if (missing.length === 0) return;

  throw new Error(
    `[student-voice-api] Missing or empty environment variable(s): ${missing.join(', ')}. ` +
      'In Vercel: Project → Settings → Environment Variables (Production). ' +
      'For Supabase: paste both the Transaction pooler URI as DATABASE_URL (port 6543, add ?pgbouncer=true) and the Direct connection as DIRECT_URL (db.*.supabase.co, port 5432). ' +
      'If your host only provides one Postgres URL, set both variables to that same value.',
  );
}

assertDatabaseEnv();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
