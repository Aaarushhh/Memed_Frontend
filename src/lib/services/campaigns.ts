import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { normalizeCampaign, normalizeCampaignList } from "@/lib/normalize";
import type { Campaign, CreateCampaignPayload } from "@/types";

export async function createCampaign(
  payload: CreateCampaignPayload
): Promise<Campaign> {
  const raw = await api.post(ENDPOINTS.campaigns.root, {
    name: payload.name,
    platform: payload.platform,
    totalBudget: payload.totalBudget,
    milestones: payload.milestones.map((m) => ({
      views: m.views,
      payout: m.payout,
    })),
  });
  return normalizeCampaign(raw);
}

/** Brand: GET /campaigns */
export async function getMyCampaigns(): Promise<Campaign[]> {
  const raw = await api.get(ENDPOINTS.campaigns.root);
  return normalizeCampaignList(raw);
}

/** Creator: GET /campaigns/live */
export async function getLiveCampaigns(): Promise<Campaign[]> {
  const raw = await api.get(ENDPOINTS.campaigns.live);
  return normalizeCampaignList(raw);
}
