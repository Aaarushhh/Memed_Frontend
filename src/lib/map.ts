import type {
  AuthResponse,
  Campaign,
  CreatorEarnings,
  Milestone,
  Submission,
  User,
} from "@/types";

type IdLike = { id?: string; _id?: string };

function idOf(value: IdLike | string | undefined | null): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String(value.id ?? value._id ?? "");
}

export function mapUser(raw: IdLike & {
  name: string;
  email: string;
  role: User["role"];
}): User {
  return {
    id: idOf(raw),
    name: raw.name,
    email: raw.email,
    role: raw.role,
  };
}

export function mapAuth(data: {
  token: string;
  user: Parameters<typeof mapUser>[0];
}): AuthResponse {
  return { token: data.token, user: mapUser(data.user) };
}

function mapMilestone(raw: Milestone): Milestone {
  return { views: Number(raw.views), payout: Number(raw.payout) };
}

export function mapCampaign(raw: IdLike & {
  name: string;
  platform: Campaign["platform"];
  totalBudget: number;
  budgetSpent?: number;
  budgetRemaining?: number;
  milestones?: Milestone[];
  brandId?: string | IdLike;
  createdAt?: string;
}): Campaign {
  return {
    id: idOf(raw),
    name: raw.name,
    platform: raw.platform,
    totalBudget: Number(raw.totalBudget),
    budgetSpent: Number(raw.budgetSpent ?? 0),
    budgetRemaining: Number(
      raw.budgetRemaining ?? Number(raw.totalBudget) - Number(raw.budgetSpent ?? 0)
    ),
    milestones: (raw.milestones ?? []).map(mapMilestone),
    brandId: raw.brandId ? idOf(raw.brandId) : undefined,
    createdAt: raw.createdAt,
  };
}

export function mapCampaignList(data: unknown): Campaign[] {
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { campaigns?: unknown[] }).campaigns)
      ? (data as { campaigns: unknown[] }).campaigns
      : [];
  return list.map((item) => mapCampaign(item as Parameters<typeof mapCampaign>[0]));
}

export function mapSubmission(raw: IdLike & {
  campaignId?: string | IdLike;
  campaign?: string | IdLike;
  creatorId?: string | IdLike;
  postUrl: string;
  views?: number;
  payout?: number;
  createdAt?: string;
}): Submission {
  return {
    id: idOf(raw),
    campaignId: idOf(raw.campaignId ?? raw.campaign),
    creatorId: raw.creatorId ? idOf(raw.creatorId) : undefined,
    postUrl: raw.postUrl,
    views: Number(raw.views ?? 0),
    payout: Number(raw.payout ?? 0),
    createdAt: raw.createdAt,
  };
}

export function mapEarnings(data: { totalEarnings?: number }): CreatorEarnings {
  return { totalEarnings: Number(data.totalEarnings ?? 0) };
}
