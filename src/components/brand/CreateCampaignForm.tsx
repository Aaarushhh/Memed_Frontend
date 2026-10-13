"use client";

import { FormEvent, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { PLATFORMS } from "@/lib/constants";
import { createCampaign } from "@/lib/services/campaigns";
import type { Campaign, Milestone, Platform } from "@/types";

interface CreateCampaignFormProps {
  onCreated: (campaign: Campaign) => void;
}

const emptyMilestone = (): Milestone => ({ views: 0, payout: 0 });

export default function CreateCampaignForm({ onCreated }: CreateCampaignFormProps) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [totalBudget, setTotalBudget] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([emptyMilestone()]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateMilestone(
    index: number,
    field: keyof Milestone,
    value: string
  ) {
    setMilestones((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: Number(value) || 0 } : item
      )
    );
  }

  function addMilestone() {
    setMilestones((prev) => [...prev, emptyMilestone()]);
  }

  function removeMilestone(index: number) {
    setMilestones((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const budget = Number(totalBudget);
    if (!name.trim() || !Number.isFinite(budget) || budget <= 0) {
      setError("Enter a valid name and total budget");
      return;
    }

    const cleaned = milestones
      .map((m) => ({
        views: Number(m.views),
        payout: Number(m.payout),
      }))
      .filter((m) => m.views > 0 && m.payout > 0)
      .sort((a, b) => a.views - b.views);

    if (cleaned.length === 0) {
      setError("Add at least one milestone with views and payout");
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
      setPlatform("Instagram");
      setMilestones([emptyMilestone()]);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create campaign"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4"
    >
      <h2 className="text-lg font-medium">Create campaign</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="campaign-name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="campaign-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="platform" className="text-sm font-medium">
            Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          >
            {PLATFORMS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="budget" className="text-sm font-medium">
            Total budget (₹)
          </label>
          <input
            id="budget"
            type="number"
            min={1}
            required
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Milestone ladder</h3>
          <button
            type="button"
            onClick={addMilestone}
            className="text-sm font-medium text-zinc-900 underline"
          >
            Add milestone
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
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              aria-label={`Milestone ${index + 1} views`}
            />
            <input
              type="number"
              min={1}
              placeholder="Payout ₹"
              value={milestone.payout || ""}
              onChange={(e) => updateMilestone(index, "payout", e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              aria-label={`Milestone ${index + 1} payout`}
            />
            <button
              type="button"
              onClick={() => removeMilestone(index)}
              className="rounded-md border border-zinc-300 px-3 text-sm"
              aria-label={`Remove milestone ${index + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {submitting ? "Creating…" : "Create campaign"}
      </button>
    </form>
  );
}
