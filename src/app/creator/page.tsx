"use client";

import { useEffect, useState } from "react";
import AuthGate from "@/components/auth/AuthGate";
import CampaignBrowser from "@/components/creator/CampaignBrowser";
import EarningsSummary from "@/components/creator/EarningsSummary";
import SubmitPostForm from "@/components/creator/SubmitPostForm";
import PageHeader from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/api";
import { getLiveCampaigns } from "@/lib/services/campaigns";
import { getMyEarnings } from "@/lib/services/submissions";
import type { Campaign } from "@/types";

function CreatorDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [totalEarnings, setTotalEarnings] = useState<number | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningsError, setEarningsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setCampaignsLoading(true);
      setEarningsLoading(true);
      setCampaignsError(null);
      setEarningsError(null);

      const [campaignResult, earningsResult] = await Promise.allSettled([
        getLiveCampaigns(),
        getMyEarnings(),
      ]);

      if (!active) return;

      if (campaignResult.status === "fulfilled") {
        setCampaigns(campaignResult.value);
        setSelectedId(campaignResult.value[0]?.id ?? null);
      } else {
        setCampaignsError(
          getErrorMessage(campaignResult.reason, "Failed to load campaigns")
        );
      }

      if (earningsResult.status === "fulfilled") {
        setTotalEarnings(earningsResult.value.totalEarnings);
      } else {
        setEarningsError(
          getErrorMessage(earningsResult.reason, "Failed to load earnings")
        );
      }

      setCampaignsLoading(false);
      setEarningsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const selected =
    campaigns.find((campaign) => campaign.id === selectedId) ?? null;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <PageHeader
        title="Creator dashboard"
        subtitle="Browse live campaigns, submit posts, and track earnings."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-medium">Live campaigns</h2>
          <CampaignBrowser
            campaigns={campaigns}
            loading={campaignsLoading}
            error={campaignsError}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>

        <div className="flex flex-col gap-6">
          <SubmitPostForm campaign={selected} />
          <EarningsSummary
            totalEarnings={totalEarnings}
            loading={earningsLoading}
            error={earningsError}
          />
        </div>
      </div>
    </main>
  );
}

export default function CreatorPage() {
  return (
    <AuthGate mode="protected" role="creator">
      <CreatorDashboard />
    </AuthGate>
  );
}
