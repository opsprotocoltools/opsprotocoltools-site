# Ops Protocol Tools — Stack Specification

## Overview

Next.js 14 + Prisma + NextAuth + PostgreSQL stack for Ops Protocol marketing site, admin, and deterministic Ops Coach.

## Stack

- Framework: Next.js 14 (App Router, TypeScript)
- Auth: NextAuth (Credentials, JWT)
- ORM: Prisma
- Database: PostgreSQL
- Styling: Tailwind CSS
- Charts: Recharts
- Hosting: Vercel

## Environment Variables

Required:
- DATABASE_URL
- NEXTAUTH_URL
- NEXTAUTH_SECRET

Optional:
- OPENAI_API_KEY

Notes:
- DATABASE_URL must be a valid Postgres connection string (postgres:// or postgresql://).
- NEXTAUTH_URL should point to the deployed URL or http://localhost:3000 in dev.
- Secrets are never committed; they live only in .env / Vercel env.

## Critical Files

These files are guarded. Update only via full replacements aligned with this spec:

- `package.json`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/seedKnowledge.ts`
- `lib/prisma.ts`
- `lib/auth.ts`
- `app/admin/analytics/page.tsx`

## Rules

Editing:
- Critical files are only edited as full-file replacements.
- No partial inline patches on critical files.
- Stack and schema changes must be reflected in this spec via a single commit.
- Assistants must prefer deterministic, minimal changes aligned to this spec.

Assistant:
- Always read ops/CHAT_BOOTSTRAP.md (generated) before touching any file.
- Never output snippets for critical files; output full contents.
- Treat this repo as the single source; do not invent migrations or models.

## Schema Expectations (Summary)

- Enum `Role`: ADMIN, USER
- `User.role` uses `Role`.
- `KnowledgeChunk` includes: domain, source, priority, tags, content, createdAt, updatedAt.
- `AnalyticsEvent` relates to `User` via `userId`.

