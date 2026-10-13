"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";

export default function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    router.replace(user.role === "brand" ? ROUTES.brand : ROUTES.creator);
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || (isAuthenticated && user)) {
    return (
      <main className="mx-auto flex min-h-full w-full max-w-md items-center justify-center px-4 py-16">
        <p className="text-sm text-zinc-600">Loading…</p>
      </main>
    );
  }

  return <>{children}</>;
}
