import { NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Lazy-load Prisma so that builds never fail if DB is unavailable.
async function getPrismaSafe() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
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
          // During build or if DB missing: do not crash, just deny.
          return null;
        }

        const email = credentials?.email || "";
        const password = credentials?.password || "";

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Expose id and role so we can use them later
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
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.role = u.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

// Used by admin pages to protect routes
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  return session.user;
}
