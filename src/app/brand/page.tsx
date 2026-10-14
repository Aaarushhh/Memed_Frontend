"use client";

import { useEffect, useState } from "react";
import AuthGate from "@/components/auth/AuthGate";
import CreateCampaignForm from "@/components/brand/CreateCampaignForm";
import CampaignList from "@/components/brand/CampaignList";
import PageHeader from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/api";
import { getMyCampaigns } from "@/lib/services/campaigns";
import type { Campaign } from "@/types";

function BrandDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyCampaigns();
        if (active) setCampaigns(data);
      } catch (err) {
        if (active) setError(getErrorMessage(err, "Failed to load campaigns"));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="page rise">
      <PageHeader
        title="Brand desk"
        subtitle="Launch campaigns and watch budget spent versus remaining."
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <CreateCampaignForm
          onCreated={(campaign) =>
            setCampaigns((prev) => [
              campaign,
              ...prev.filter((c) => c.id !== campaign.id),
            ])
          }
        />
        <section>
          <h2 className="font-display mb-3 text-xl font-bold tracking-tight">
            Your campaigns
          </h2>
          <CampaignList campaigns={campaigns} loading={loading} error={error} />
        </section>
      </div>
    </main>
  );
}

export default function BrandPage() {
  return (
    <AuthGate mode="protected" role="brand">
      <BrandDashboard />
    </AuthGate>
  );
}
