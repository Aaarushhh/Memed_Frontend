"use client";

import { useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import CreateCampaignForm from "@/components/brand/CreateCampaignForm";
import CampaignList from "@/components/brand/CampaignList";
import PageHeader from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/errors";
import { getMyCampaigns } from "@/lib/services/campaigns";
import type { Campaign } from "@/types";

function BrandDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load campaigns"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  function handleCreated(campaign: Campaign) {
    setCampaigns((prev) => [campaign, ...prev.filter((c) => c.id !== campaign.id)]);
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <PageHeader
        title="Brand dashboard"
        subtitle="Create campaigns and track budget spent vs remaining."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <CreateCampaignForm onCreated={handleCreated} />
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Your campaigns</h2>
            <button
              type="button"
              onClick={() => void loadCampaigns()}
              className="text-sm font-medium text-zinc-900 underline"
            >
              Refresh
            </button>
          </div>
          <CampaignList campaigns={campaigns} loading={loading} error={error} />
        </section>
      </div>
    </main>
  );
}

export default function BrandPage() {
  return (
    <RequireAuth role="brand">
      <BrandDashboard />
    </RequireAuth>
  );
}
