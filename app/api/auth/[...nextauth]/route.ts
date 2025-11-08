import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Lazy-load Prisma so builds do not fail if DB is unreachable
async function getPrismaSafe() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const prisma = await getPrismaSafe();

        // If Prisma or DATABASE_URL is not available (e.g. during build), do not crash.
        if (!prisma || !process.env.DATABASE_URL) {
          return null;
        }

        const email = credentials?.email || "";
        const password = credentials?.password || "";

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const passwordOk = await bcrypt.compare(password, user.passwordHash);
        if (!passwordOk) {
          return null;
        }

        // This is the "user" object NextAuth will pass into callbacks.
        // We explicitly include role so we can read it later.
        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? "",
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, copy custom fields onto the token.
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.role = u.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose id and role on session.user for the app to read.
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// Next.js App Router API route handlers
export { handler as GET, handler as POST };
