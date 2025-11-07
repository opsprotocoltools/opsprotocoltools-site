@'
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (c) => {
        if (
          c?.email === process.env.ADMIN_EMAIL &&
          c?.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", name: "Admin", email: c.email };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
'@ | Out-File "app\api\auth\[...nextauth]\route.ts" -Encoding utf8
