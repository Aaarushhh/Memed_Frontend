"use client";

import { FormEvent, useState } from "react";
import { getErrorMessage } from "@/lib/api";
import { submitPost } from "@/lib/services/submissions";
import type { Campaign } from "@/types";

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
    <form onSubmit={handleSubmit} className="panel flex flex-col gap-4">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">Submit a post</h2>
        <p className="muted mt-1 text-sm">
          {campaign
            ? `${campaign.name} · ${campaign.platform}`
            : "Pick a live campaign first"}
        </p>
      </div>

      <div>
        <label htmlFor="post-url" className="label">
          Post link
        </label>
        <input
          id="post-url"
          type="url"
          required
          placeholder="https://..."
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          className="field"
        />
      </div>

      {error ? (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      ) : null}

      {success ? <p className="alert alert-success">{success}</p> : null}

      <button
        type="submit"
        disabled={submitting || !campaign}
        className="btn btn-primary"
      >
        {submitting ? "Submitting…" : "Submit post"}
      </button>
    </form>
  );
}
