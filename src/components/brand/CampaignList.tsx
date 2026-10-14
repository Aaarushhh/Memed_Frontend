"use client";

import { formatInr } from "@/lib/format";
import type { Campaign } from "@/types";

interface Props {
  campaigns: Campaign[];
  loading?: boolean;
  error?: string | null;
}

export default function CampaignList({ campaigns, loading, error }: Props) {
  if (loading) return <p className="muted text-sm">Loading campaigns…</p>;
  if (error) {
    return (
      <p className="alert alert-error" role="alert">
        {error}
      </p>
    );
  }
  if (campaigns.length === 0) {
    return (
      <div className="panel">
        <p className="muted text-sm">No campaigns yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {campaigns.map((campaign, index) => {
        const spentPct =
          campaign.totalBudget > 0
            ? Math.min(
                100,
                Math.round((campaign.budgetSpent / campaign.totalBudget) * 100)
              )
            : 0;

        return (
          <li
            key={campaign.id}
            className={`panel rise ${index === 0 ? "" : ""}`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight">
                  {campaign.name}
                </h3>
                <p className="muted mt-0.5 text-sm">{campaign.platform}</p>
              </div>
              <p className="rounded-lg bg-[var(--accent)] px-2.5 py-1 text-sm font-semibold">
                {formatInr(campaign.totalBudget)}
              </p>
            </div>

            <div className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
              <p>
                Spent{" "}
                <span className="font-semibold">{formatInr(campaign.budgetSpent)}</span>
              </p>
              <p>
                Remaining{" "}
                <span className="font-semibold">
                  {formatInr(campaign.budgetRemaining)}
                </span>
              </p>
            </div>

            <div className="progress mt-3">
              <span style={{ width: `${spentPct}%` }} />
            </div>
            <p className="muted mt-1.5 text-xs">{spentPct}% of budget used</p>

            {campaign.milestones.length > 0 ? (
              <ul className="mt-3 space-y-1 border-t border-[var(--line)] pt-3 text-sm">
                {campaign.milestones.map((m) => (
                  <li
                    key={`${campaign.id}-${m.views}-${m.payout}`}
                    className="flex justify-between gap-3"
                  >
                    <span className="muted">
                      {m.views.toLocaleString("en-IN")} views
                    </span>
                    <span className="font-medium">{formatInr(m.payout)}</span>
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
