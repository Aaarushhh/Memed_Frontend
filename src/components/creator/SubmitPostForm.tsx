"use client";

import { FormEvent, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { submitPost } from "@/lib/services/submissions";
import type { Campaign, Submission } from "@/types";

interface SubmitPostFormProps {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onSelectCampaign: (campaignId: string) => void;
  onSubmitted: (submission: Submission) => void;
}

export default function SubmitPostForm({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
  onSubmitted,
}: SubmitPostFormProps) {
  const [postUrl, setPostUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedCampaignId) {
      setError("Select a campaign first");
      return;
    }

    const url = postUrl.trim();
    if (!url) {
      setError("Enter a post URL");
      return;
    }

    setSubmitting(true);
    try {
      const submission = await submitPost({
        campaignId: selectedCampaignId,
        postUrl: url,
      });
      onSubmitted(submission);
      setPostUrl("");
      setSuccess("Post submitted successfully");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to submit post"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4"
    >
      <h2 className="text-lg font-medium">Submit a post</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="campaign" className="text-sm font-medium">
          Campaign
        </label>
        <select
          id="campaign"
          value={selectedCampaignId ?? ""}
          onChange={(e) => onSelectCampaign(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        >
          <option value="" disabled>
            Select a live campaign
          </option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name} ({campaign.platform})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="post-url" className="text-sm font-medium">
          Post link
        </label>
        <input
          id="post-url"
          type="url"
          required
          placeholder="https://..."
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </div>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || campaigns.length === 0}
        className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit post"}
      </button>
    </form>
  );
}
