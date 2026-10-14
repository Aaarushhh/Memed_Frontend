"use client";

import { formatInr } from "@/lib/format";
import type { Campaign } from "@/types";

interface Props {
  campaigns: Campaign[];
  loading?: boolean;
  error?: string | null;
}

export default function CampaignList({ campaigns, loading, error }: Props) {
  if (loading) return <p className="text-sm text-zinc-600">Loading campaigns…</p>;
  if (error) {
    return (
      <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
        {error}
      </p>
    );
  }
  if (campaigns.length === 0) {
    return <p className="text-sm text-zinc-600">No campaigns yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {campaigns.map((campaign) => {
        const spentPct =
          campaign.totalBudget > 0
            ? Math.min(
                100,
                Math.round((campaign.budgetSpent / campaign.totalBudget) * 100)
              )
            : 0;

        return (
          <li key={campaign.id} className="rounded-lg border border-zinc-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-medium">{campaign.name}</h3>
                <p className="text-sm text-zinc-600">{campaign.platform}</p>
              </div>
              <p className="text-sm text-zinc-600">
                {formatInr(campaign.totalBudget)}
              </p>
            </div>

            <div className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
              <p>
                Spent: <span className="font-medium">{formatInr(campaign.budgetSpent)}</span>
              </p>
              <p>
                Remaining:{" "}
                <span className="font-medium">{formatInr(campaign.budgetRemaining)}</span>
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full bg-zinc-900" style={{ width: `${spentPct}%` }} />
            </div>

            {campaign.milestones.length > 0 ? (
              <ul className="mt-3 space-y-0.5 text-sm text-zinc-700">
                {campaign.milestones.map((m) => (
                  <li key={`${campaign.id}-${m.views}-${m.payout}`}>
                    {m.views.toLocaleString("en-IN")} views → {formatInr(m.payout)}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
