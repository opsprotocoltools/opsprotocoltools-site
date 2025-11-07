"use client";

import { useState, useTransition, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);

    if (res.ok) router.push("/admin");
    else alert("Login failed");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-80"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-2">{error}</p>
        )}

        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
