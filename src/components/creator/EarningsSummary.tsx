"use client";

import { formatInr } from "@/lib/format";
import type { CreatorEarnings } from "@/types";

interface EarningsSummaryProps {
  earnings: CreatorEarnings | null;
  loading?: boolean;
  error?: string | null;
}

export default function EarningsSummary({
  earnings,
  loading,
  error,
}: EarningsSummaryProps) {
  if (loading) {
    return <p className="text-sm text-zinc-600">Loading earnings…</p>;
  }

  if (error) {
    return (
      <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (!earnings) {
    return <p className="text-sm text-zinc-600">No earnings data yet.</p>;
  }

  const hasSubmissions = earnings.submissions.length > 0;

  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <h2 className="text-lg font-medium">Your earnings</h2>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {formatInr(earnings.totalEarnings)}
      </p>
      <p className="mt-1 text-sm text-zinc-600">
        Total payout from crossed milestones
      </p>

      {hasSubmissions ? (
        <ul className="mt-4 flex flex-col gap-2">
          {earnings.submissions.map((submission) => (
            <li
              key={submission.id}
              className="rounded-md border border-zinc-100 px-3 py-2 text-sm"
            >
              <a
                href={submission.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-medium text-zinc-900 underline"
              >
                {submission.postUrl}
              </a>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-zinc-600">
                <span>{submission.views.toLocaleString("en-IN")} views</span>
                <span>Payout {formatInr(submission.payout)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-zinc-600">
          Submit a post, then update views on the backend to unlock milestone payouts.
        </p>
      )}
    </div>
  );
}
