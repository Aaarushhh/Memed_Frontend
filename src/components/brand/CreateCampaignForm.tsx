"use client";

import { FormEvent, useState } from "react";
import { getErrorMessage } from "@/lib/api";
import { DEFAULT_PLATFORM, PLATFORMS } from "@/lib/constants";
import { createCampaign } from "@/lib/services/campaigns";
import type { Campaign, Milestone, Platform } from "@/types";

interface Props {
  onCreated: (campaign: Campaign) => void;
}

export default function CreateCampaignForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Platform>(DEFAULT_PLATFORM);
  const [totalBudget, setTotalBudget] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([
    { views: 0, payout: 0 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateMilestone(index: number, key: keyof Milestone, value: string) {
    setMilestones((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: Number(value) || 0 } : item
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const budget = Number(totalBudget);
    const cleaned = milestones
      .filter((m) => m.views > 0 && m.payout > 0)
      .sort((a, b) => a.views - b.views);

    if (!name.trim() || !(budget > 0) || cleaned.length === 0) {
      setError("Name, budget, and at least one milestone are required");
      return;
    }

    setSubmitting(true);
    try {
      const campaign = await createCampaign({
        name: name.trim(),
        platform,
        totalBudget: budget,
        milestones: cleaned,
      });
      onCreated(campaign);
      setName("");
      setTotalBudget("");
      setPlatform(DEFAULT_PLATFORM);
      setMilestones([{ views: 0, payout: 0 }]);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create campaign"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel flex flex-col gap-4">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">Create campaign</h2>
        <p className="muted mt-1 text-sm">Set budget and a milestone ladder.</p>
      </div>

      <div>
        <label htmlFor="campaign-name" className="label">
          Name
        </label>
        <input
          id="campaign-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="platform" className="label">
            Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="field"
          >
            {PLATFORMS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="label">
            Total budget (₹)
          </label>
          <input
            id="budget"
            type="number"
            min={1}
            required
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            className="field"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Milestones</h3>
          <button
            type="button"
            onClick={() =>
              setMilestones((prev) => [...prev, { views: 0, payout: 0 }])
            }
            className="text-sm font-semibold underline"
          >
            Add row
          </button>
        </div>

        {milestones.map((milestone, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input
              type="number"
              min={1}
              placeholder="Views"
              value={milestone.views || ""}
              onChange={(e) => updateMilestone(index, "views", e.target.value)}
              className="field"
            />
            <input
              type="number"
              min={1}
              placeholder="Payout ₹"
              value={milestone.payout || ""}
              onChange={(e) => updateMilestone(index, "payout", e.target.value)}
              className="field"
            />
            <button
              type="button"
              onClick={() =>
                setMilestones((prev) =>
                  prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)
                )
              }
              className="btn btn-ghost px-3"
              aria-label={`Remove milestone ${index + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {error ? (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? "Creating…" : "Create campaign"}
      </button>
    </form>
  );
}
