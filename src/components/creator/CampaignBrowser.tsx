"use client";

import { formatInr } from "@/lib/format";
import type { Campaign } from "@/types";

interface Props {
  campaigns: Campaign[];
  loading?: boolean;
  error?: string | null;
  selectedId: string | null;
  onSelect: (campaignId: string) => void;
}

export default function CampaignBrowser({
  campaigns,
  loading,
  error,
  selectedId,
  onSelect,
}: Props) {
  if (loading) return <p className="text-sm text-zinc-600">Loading campaigns…</p>;
  if (error) {
    return (
      <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
        {error}
      </p>
    );
  }
  if (campaigns.length === 0) {
    return <p className="text-sm text-zinc-600">No live campaigns.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {campaigns.map((campaign) => {
        const selected = selectedId === campaign.id;
        return (
          <li key={campaign.id}>
            <button
              type="button"
              onClick={() => onSelect(campaign.id)}
              className={`w-full rounded-lg border p-4 text-left ${
                selected
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium">{campaign.name}</h3>
                  <p className="text-sm text-zinc-600">{campaign.platform}</p>
                </div>
                <p className="text-sm text-zinc-600">
                  Remaining {formatInr(campaign.budgetRemaining)}
                </p>
              </div>
              {campaign.milestones.length > 0 ? (
                <ul className="mt-2 space-y-0.5 text-sm text-zinc-700">
                  {campaign.milestones.map((m) => (
                    <li key={`${campaign.id}-${m.views}-${m.payout}`}>
                      {m.views.toLocaleString("en-IN")} views → {formatInr(m.payout)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
