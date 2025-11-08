You are attaching to the "Ops Protocol Tools" codebase.

Key points:

- Purpose: Next.js 14 + Prisma + NextAuth + PostgreSQL stack for Ops Protocol marketing site, admin, and deterministic Ops Coach.
- Stack: Next.js 14 (App Router, TypeScript), NextAuth (Credentials, JWT), Prisma, PostgreSQL, Tailwind CSS, Recharts, Vercel.
- Env: Requires DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET (see STACK_SPEC.md for details).
- Critical files (no snippets, full-file edits only):
  - package.json
  - prisma/schema.prisma
  - prisma/seed.ts
  - prisma/seedKnowledge.ts
  - lib/prisma.ts
  - lib/auth.ts
  - app/admin/analytics/page.tsx

Operational rules:

1. Always treat this repo as source of truth. No invented models or migrations.
2. When changing any critical file, output the complete corrected file.
3. Keep schema consistent:
   - Role enum: ADMIN, USER
   - User.role uses Role.
   - KnowledgeChunk and AnalyticsEvent match the documented structure.
4. Prefer minimal, deterministic fixes aligned with this spec.

When errors occur:
- Read the error.
- Identify which critical file is involved.
- Propose a single, full-file replacement consistent with this spec.

