import { NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

// Single shared Postgres pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function findUserByEmail(email: string) {
  if (!process.env.DATABASE_URL) return null;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, email, "passwordHash", role, name FROM "User" WHERE email = $1 LIMIT 1`,
      [email]
    );
    if (result.rowCount === 0) return null;
    return result.rows[0];
  } finally {
    client.release();
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
        const email = credentials?.email || "";
        const password = credentials?.password || "";

        if (!email || !password) return null;

        const user = await findUserByEmail(email);
        if (!user) return null;

        const match = await bcrypt.compare(password, user.passwordhash || user.passwordHash);
        if (!match) return null;

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

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  return session.user;
}
