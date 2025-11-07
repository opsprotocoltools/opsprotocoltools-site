// lib/auth.ts

import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { logEvent } from "@/lib/analytics";
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";

// NextAuth options (v4 style)
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
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          await logEvent("auth.login_failed", {
            metadata: {
              reason: "user_not_found",
              email: credentials.email,
            },
          });
          return null;
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
          return null;
        }

        await logEvent("auth.login_success", { userId: user.id });

        // Object returned here becomes `user` in JWT callback
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On login, copy role from user into token
      if (user) {
        token.role = (user as any).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      // Expose id + role on session.user
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

// Helper to get the current session on the server
export async function auth() {
  return getServerSession(authOptions);
}

// Require ADMIN role on the server
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return user;
}

// Client-side helpers (used in login page etc.)
export const signIn = nextAuthSignIn;
export const signOut = nextAuthSignOut;
