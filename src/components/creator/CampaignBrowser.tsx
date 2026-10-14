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
        <p className="muted text-sm">No live campaigns right now.</p>
      </div>
    );
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
              className={`panel w-full text-left transition-[border-color,background,transform] ${
                selected
                  ? "panel-selected"
                  : "hover:-translate-y-0.5 hover:border-[var(--ink)]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight">
                    {campaign.name}
                  </h3>
                  <p className="muted mt-0.5 text-sm">{campaign.platform}</p>
                </div>
                <p className="text-sm font-semibold">
                  {formatInr(campaign.budgetRemaining)}
                  <span className="muted ml-1 font-normal">left</span>
                </p>
              </div>

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

              {selected ? (
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide">
                  Selected for submission
                </p>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
