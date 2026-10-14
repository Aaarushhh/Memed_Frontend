"use client";

import { formatInr } from "@/lib/format";

interface Props {
  totalEarnings: number | null;
  loading?: boolean;
  error?: string | null;
}

export default function EarningsSummary({ totalEarnings, loading, error }: Props) {
  if (loading) return <p className="text-sm text-zinc-600">Loading earnings…</p>;
  if (error) {
    return (
      <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <h2 className="text-lg font-medium">Your earnings</h2>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {formatInr(totalEarnings ?? 0)}
      </p>
      <p className="mt-1 text-sm text-zinc-600">
        Updates after view milestones are crossed on the backend.
      </p>
    </div>
  );
}
