"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams?.get("error");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/admin",
    });

    setLoading(false);

    if (result?.ok) {
      router.push("/admin");
    } else {
      setLocalError("Invalid email or password.");
    }
  }

  const errorMessage = localError || (urlError ? "Invalid email or password." : "");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-80 rounded-xl bg-white p-6 shadow-md"
      >
        <h1 className="mb-4 text-center text-xl font-semibold">
          Ops Protocol Tools
        </h1>

        {errorMessage && (
          <p className="mb-3 text-center text-xs text-red-600">
            {errorMessage}
          </p>
        )}

        <label className="mb-2 block text-xs font-medium text-slate-600">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="mb-3 w-full rounded border border-slate-300 px-2 py-1 text-sm"
          placeholder="opsprotocoltools@gmail.com"
        />

        <label className="mb-2 block text-xs font-medium text-slate-600">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="mb-4 w-full rounded border border-slate-300 px-2 py-1 text-sm"
          placeholder="Password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
