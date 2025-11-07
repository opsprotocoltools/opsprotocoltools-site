// lib/auth.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { logEvent } from "@/lib/analytics";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          await logEvent("auth.login_failed", {
            metadata: { reason: "missing_credentials" },
          });
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          await logEvent("auth.login_failed", {
            metadata: { reason: "user_not_found", email: credentials.email },
          });
          throw new Error("Invalid email or password");
        }

        const isValid = await compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          await logEvent("auth.login_failed", {
            userId: user.id,
            metadata: { reason: "bad_password" },
          });
          throw new Error("Invalid email or password");
        }

        await logEvent("auth.login_success", {
          userId: user.id,
        });

        return {
          id: String(user.id),
          name: user.name ?? null,
          email: user.email,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role ?? "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const nextAuthHandler = NextAuth(authOptions);

export const handlers = {
  GET: nextAuthHandler,
  POST: nextAuthHandler,
};

// Get current session (server-side)
export async function auth() {
  return getServerSession(authOptions);
}

// Require ADMIN; used by admin pages and actions
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return user;
}

// Client helpers
export { signIn, signOut };
