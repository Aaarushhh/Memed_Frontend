import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { mapCampaign, mapCampaignList } from "@/lib/map";
import type { Campaign, CreateCampaignPayload } from "@/types";

export async function createCampaign(
  payload: CreateCampaignPayload
): Promise<Campaign> {
  const data = await api.post<{ campaign: Parameters<typeof mapCampaign>[0] }>(
    ENDPOINTS.campaigns.root,
    payload
  );
  return mapCampaign(data.campaign);
}

export async function getMyCampaigns(): Promise<Campaign[]> {
  const data = await api.get(ENDPOINTS.campaigns.root);
  return mapCampaignList(data);
}

export async function getLiveCampaigns(): Promise<Campaign[]> {
  const data = await api.get(ENDPOINTS.campaigns.live);
  return mapCampaignList(data);
}
