"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types";

interface RequireAuthProps {
  role?: UserRole;
  children: React.ReactNode;
}

export default function RequireAuth({ role, children }: RequireAuthProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace(ROUTES.login);
      return;
    }
    if (role && user.role !== role) {
      router.replace(user.role === "brand" ? ROUTES.brand : ROUTES.creator);
    }
  }, [isLoading, isAuthenticated, user, role, router]);

  if (isLoading || !isAuthenticated || !user || (role && user.role !== role)) {
    return (
      <main className="mx-auto flex min-h-full w-full max-w-4xl items-center justify-center px-4 py-16">
        <p className="text-sm text-zinc-600">Loading…</p>
      </main>
    );
  }

  return <>{children}</>;
}
