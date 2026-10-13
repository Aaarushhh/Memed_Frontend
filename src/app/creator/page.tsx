"use client";

import { useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import CampaignBrowser from "@/components/creator/CampaignBrowser";
import EarningsSummary from "@/components/creator/EarningsSummary";
import SubmitPostForm from "@/components/creator/SubmitPostForm";
import PageHeader from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/errors";
import { getLiveCampaigns } from "@/lib/services/campaigns";
import { getMyEarnings } from "@/lib/services/submissions";
import type { Campaign, CreatorEarnings, Submission } from "@/types";

function CreatorDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null
  );

  const [earnings, setEarnings] = useState<CreatorEarnings | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningsError, setEarningsError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    setCampaignsError(null);
    try {
      const data = await getLiveCampaigns();
      setCampaigns(data);
      setSelectedCampaignId((prev) => {
        if (prev && data.some((c) => c.id === prev)) return prev;
        return data[0]?.id ?? null;
      });
    } catch (err) {
      setCampaignsError(getErrorMessage(err, "Failed to load campaigns"));
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  const loadEarnings = useCallback(async () => {
    setEarningsLoading(true);
    setEarningsError(null);
    try {
      const data = await getMyEarnings();
      // API returns `{ totalEarnings }`; keep any locally known submissions
      setEarnings((prev) => ({
        totalEarnings: data.totalEarnings,
        submissions:
          data.submissions.length > 0
            ? data.submissions
            : (prev?.submissions ?? []),
      }));
    } catch (err) {
      setEarningsError(getErrorMessage(err, "Failed to load earnings"));
    } finally {
      setEarningsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCampaigns();
    void loadEarnings();
  }, [loadCampaigns, loadEarnings]);

  function handleSubmitted(submission: Submission) {
    setEarnings((prev) => ({
      totalEarnings: prev?.totalEarnings ?? 0,
      submissions: [
        submission,
        ...(prev?.submissions.filter((s) => s.id !== submission.id) ?? []),
      ],
    }));
    void loadEarnings();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <PageHeader
        title="Creator dashboard"
        subtitle="Browse live campaigns, submit posts, and track earnings."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Live campaigns</h2>
            <button
              type="button"
              onClick={() => void loadCampaigns()}
              className="text-sm font-medium text-zinc-900 underline"
            >
              Refresh
            </button>
          </div>
          <CampaignBrowser
            campaigns={campaigns}
            loading={campaignsLoading}
            error={campaignsError}
            selectedId={selectedCampaignId}
            onSelect={setSelectedCampaignId}
          />
        </section>

        <div className="flex flex-col gap-6">
          <SubmitPostForm
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            onSelectCampaign={setSelectedCampaignId}
            onSubmitted={handleSubmitted}
          />
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="sr-only">Earnings</h2>
              <button
                type="button"
                onClick={() => void loadEarnings()}
                className="ml-auto text-sm font-medium text-zinc-900 underline"
              >
                Refresh earnings
              </button>
            </div>
            <EarningsSummary
              earnings={earnings}
              loading={earningsLoading}
              error={earningsError}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

export default function CreatorPage() {
  return (
    <RequireAuth role="creator">
      <CreatorDashboard />
    </RequireAuth>
  );
}
