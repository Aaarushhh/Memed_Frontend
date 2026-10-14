"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();

  return (
    <header className="mb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={ROUTES.home} className="brand-mark text-2xl tracking-tight">
          Meme&apos;d
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="muted hidden text-sm sm:inline">
              {user.name}
              <span className="mx-1.5 opacity-40">·</span>
              <span className="capitalize">{user.role}</span>
            </span>
            <button type="button" onClick={logout} className="btn btn-ghost py-2 text-sm">
              Logout
            </button>
          </div>
        ) : null}
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {subtitle ? <p className="muted mt-2 max-w-2xl text-base">{subtitle}</p> : null}
    </header>
  );
}
