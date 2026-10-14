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
      <main className="flex min-h-dvh items-center justify-center px-4">
        <p className="muted text-sm">Loading…</p>
      </main>
    );
  }

  return (
    <main className="atmos flex min-h-dvh flex-col">
      <div className="page flex flex-1 flex-col justify-center py-16 sm:py-20">
        <p className="brand-mark rise text-5xl sm:text-7xl md:text-8xl">Meme&apos;d</p>
        <p className="rise rise-delay-1 mt-5 max-w-md text-lg text-[var(--muted)] sm:text-xl">
          Brands fund campaigns. Creators post. Payouts climb the milestone ladder.
        </p>
        <div className="rise rise-delay-2 mt-8 flex flex-wrap gap-3">
          <Link href={ROUTES.signup} className="btn btn-accent">
            Get started
          </Link>
          <Link href={ROUTES.login} className="btn btn-ghost">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
