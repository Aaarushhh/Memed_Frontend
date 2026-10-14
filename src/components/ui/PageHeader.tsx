"use client";

import { useAuth } from "@/context/AuthContext";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();

  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-zinc-600">{subtitle}</p> : null}
        {user ? (
          <p className="mt-1 text-xs text-zinc-500">
            {user.name} · {user.role}
          </p>
        ) : null}
      </div>
      {user ? (
        <button
          type="button"
          onClick={logout}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
        >
          Logout
        </button>
      ) : null}
    </header>
  );
}
