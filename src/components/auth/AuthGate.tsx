"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES, dashboardRoute } from "@/lib/constants";
import type { UserRole } from "@/types";

export default function AuthGate({
  mode,
  role,
  children,
}: {
  mode: "guest" | "protected";
  role?: UserRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (mode === "guest") {
      if (isAuthenticated && user) router.replace(dashboardRoute(user.role));
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace(ROUTES.login);
      return;
    }

    if (role && user.role !== role) {
      router.replace(dashboardRoute(user.role));
    }
  }, [isLoading, isAuthenticated, user, mode, role, router]);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-full items-center justify-center px-4 py-16">
        <p className="text-sm text-zinc-600">Loading…</p>
      </main>
    );
  }

  if (mode === "guest") {
    if (isAuthenticated) return null;
    return <>{children}</>;
  }

  if (!isAuthenticated || !user || (role && user.role !== role)) return null;
  return <>{children}</>;
}
