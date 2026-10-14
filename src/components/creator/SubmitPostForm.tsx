"use client";

import { FormEvent, useState } from "react";
import { getErrorMessage } from "@/lib/api";
import { submitPost } from "@/lib/services/submissions";
import type { Campaign } from "@/types";

const field =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500";

interface Props {
  campaign: Campaign | null;
}

export default function SubmitPostForm({ campaign }: Props) {
  const [postUrl, setPostUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!campaign) {
      setError("Select a campaign from the list");
      return;
    }

    setSubmitting(true);
    try {
      await submitPost({
        campaignId: campaign.id,
        postUrl: postUrl.trim(),
      });
      setPostUrl("");
      setSuccess("Post submitted");
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

      <p className="text-sm text-zinc-600">
        {campaign
          ? `Selected: ${campaign.name} (${campaign.platform})`
          : "Select a live campaign first"}
      </p>

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
          className={field}
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
        disabled={submitting || !campaign}
        className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit post"}
      </button>
    </form>
  );
}
