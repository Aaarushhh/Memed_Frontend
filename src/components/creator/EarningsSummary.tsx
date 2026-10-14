"use client";

import { formatInr } from "@/lib/format";

interface Props {
  totalEarnings: number | null;
  loading?: boolean;
  error?: string | null;
}

export default function EarningsSummary({ totalEarnings, loading, error }: Props) {
  if (loading) return <p className="muted text-sm">Loading earnings…</p>;
  if (error) {
    return (
      <p className="alert alert-error" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className="panel relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--accent)] opacity-70"
      />
      <h2 className="font-display relative text-xl font-bold tracking-tight">
        Your earnings
      </h2>
      <p className="font-display relative mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {formatInr(totalEarnings ?? 0)}
      </p>
      <p className="muted relative mt-2 text-sm">
        Grows when your posts cross campaign milestones.
      </p>
    </div>
  );
}
