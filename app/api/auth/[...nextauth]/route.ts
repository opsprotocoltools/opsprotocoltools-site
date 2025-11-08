import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Build-safe wrapper: Prisma loaded only when needed.
async function getPrismaSafe() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const prisma = await getPrismaSafe();
        if (!prisma || !process.env.DATABASE_URL) {
          // During build or DB misconfigured → no login, but no crash
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials?.email || "" },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(
          credentials?.password || "",
          user.passwordHash
        );
        if (!ok) return null;

        return {
          id: String(user.id),
          email: user.email,
          role: user.role,
          name: user.name || "",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export const { GET, POST } = handler;

// Simple health check so Vercel build never breaks this route
export async function HEAD() {
  return NextResponse.json({ ok: true });
}
