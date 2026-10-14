"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES, dashboardRoute } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(dashboardRoute(user.role));
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-full items-center justify-center px-4 py-16">
        <p className="text-sm text-zinc-600">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-6 px-4 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Meme&apos;d</h1>
        <p className="mt-2 text-zinc-600">
          Campaign payout tracker for brands and creators.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href={ROUTES.login}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Login
        </Link>
        <Link
          href={ROUTES.signup}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium"
        >
          Sign up
        </Link>
      </div>
    </main>
  );
}
