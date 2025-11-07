// app/login/page.tsx

"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/admin",
    });

    setLoading(false);

    if (res && !res.error) {
      router.push("/admin");
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">
          Admin access
        </h1>
        <p className="text-xs text-slate-400 text-center">
          Use your Ops Protocol Tools admin credentials.
        </p>

        {error && (
          <div className="text-xs text-red-400">
            Invalid email or password.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-cyan-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500/90 hover:bg-cyan-400 py-2 text-sm font-semibold text-slate-950 transition"
          >
            {loading ? "Signing in" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
