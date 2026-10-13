import type {
  AuthResponse,
  Campaign,
  CreatorEarnings,
  Milestone,
  Platform,
  Submission,
  User,
  UserRole,
} from "@/types";

type LooseUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
};

export type LooseAuthPayload = {
  token?: string;
  accessToken?: string;
  user?: LooseUser;
  data?: {
    token?: string;
    accessToken?: string;
    user?: LooseUser;
  };
};

type LooseMilestone = {
  viewThreshold?: number;
  views?: number;
  threshold?: number;
  payout?: number;
  amount?: number;
};

type LooseCampaign = {
  id?: string;
  _id?: string;
  name?: string;
  platform?: Platform;
  totalBudget?: number;
  budget?: number;
  budgetSpent?: number;
  spent?: number;
  budgetRemaining?: number;
  remaining?: number;
  remainingBudget?: number;
  milestones?: LooseMilestone[];
  milestoneLadder?: LooseMilestone[];
  brandId?: string;
  brand?: string | { id?: string; _id?: string };
  createdAt?: string;
};

function unwrapData<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

function asList(raw: unknown, keys: string[] = ["campaigns", "submissions"]): unknown[] {
  const unwrapped = unwrapData<unknown>(raw);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (unwrapped && typeof unwrapped === "object") {
    for (const key of keys) {
      const value = (unwrapped as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value;
    }
  }
  return [];
}

type LooseSubmission = {
  id?: string;
  _id?: string;
  campaignId?: string;
  campaign?: string | { id?: string; _id?: string };
  creatorId?: string;
  creator?: string | { id?: string; _id?: string };
  postUrl?: string;
  url?: string;
  link?: string;
  views?: number;
  viewCount?: number;
  payout?: number;
  earnings?: number;
  createdAt?: string;
};

function resolveRefId(
  direct?: string,
  nested?: string | { id?: string; _id?: string }
): string {
  if (direct) return String(direct);
  if (typeof nested === "string") return nested;
  if (nested && typeof nested === "object") {
    const id = nested.id ?? nested._id;
    if (id) return String(id);
  }
  return "";
}

export function normalizeUser(raw: LooseUser): User {
  const id = raw.id ?? raw._id;
  if (!id || !raw.name || !raw.email || !raw.role) {
    throw new Error("Auth response is missing user fields");
  }
  return {
    id: String(id),
    name: raw.name,
    email: raw.email,
    role: raw.role,
  };
}

export function normalizeAuthResponse(raw: unknown): AuthResponse {
  const body = (raw ?? {}) as LooseAuthPayload;
  const payload = body.data ?? body;
  const token = payload.token ?? payload.accessToken;
  const user = payload.user;

  if (!token || !user) {
    throw new Error("Auth response is missing token or user");
  }

  return {
    token,
    user: normalizeUser(user),
  };
}

function normalizeMilestone(raw: LooseMilestone): Milestone {
  const views = raw.views ?? raw.viewThreshold ?? raw.threshold;
  const payout = raw.payout ?? raw.amount;
  if (views == null || payout == null) {
    throw new Error("Milestone is missing views or payout");
  }
  return { views: Number(views), payout: Number(payout) };
}

function resolveBrandId(raw: LooseCampaign): string {
  if (raw.brandId) return String(raw.brandId);
  if (typeof raw.brand === "string") return raw.brand;
  if (raw.brand && typeof raw.brand === "object") {
    const id = raw.brand.id ?? raw.brand._id;
    if (id) return String(id);
  }
  return "";
}

export function normalizeCampaign(raw: unknown): Campaign {
  const unwrapped = unwrapData<LooseCampaign | { campaign?: LooseCampaign }>(raw);
  const body =
    unwrapped &&
    typeof unwrapped === "object" &&
    "campaign" in unwrapped &&
    unwrapped.campaign
      ? unwrapped.campaign
      : (unwrapped as LooseCampaign);
  const id = body.id ?? body._id;
  const totalBudget = body.totalBudget ?? body.budget;
  const milestonesRaw = body.milestones ?? body.milestoneLadder ?? [];

  if (!id || !body.name || !body.platform || totalBudget == null) {
    throw new Error("Campaign response is missing required fields");
  }

  const budgetSpent = Number(body.budgetSpent ?? body.spent ?? 0);
  const budgetRemaining = Number(
    body.budgetRemaining ??
      body.remaining ??
      body.remainingBudget ??
      Number(totalBudget) - budgetSpent
  );

  return {
    id: String(id),
    name: body.name,
    platform: body.platform,
    totalBudget: Number(totalBudget),
    budgetSpent,
    budgetRemaining,
    milestones: milestonesRaw.map(normalizeMilestone),
    brandId: resolveBrandId(body),
    createdAt: body.createdAt,
  };
}

export function normalizeCampaignList(raw: unknown): Campaign[] {
  return asList(raw, ["campaigns"]).map(normalizeCampaign);
}

export function normalizeSubmission(raw: unknown): Submission {
  const unwrapped = unwrapData<
    LooseSubmission | { submission?: LooseSubmission }
  >(raw);
  const body =
    unwrapped &&
    typeof unwrapped === "object" &&
    "submission" in unwrapped &&
    unwrapped.submission
      ? unwrapped.submission
      : (unwrapped as LooseSubmission);

  const id = body.id ?? body._id;
  const postUrl = body.postUrl ?? body.url ?? body.link;
  const campaignId = resolveRefId(body.campaignId, body.campaign);
  const creatorId = resolveRefId(body.creatorId, body.creator);

  if (!id || !postUrl || !campaignId) {
    throw new Error("Submission response is missing required fields");
  }

  return {
    id: String(id),
    campaignId,
    creatorId,
    postUrl,
    views: Number(body.views ?? body.viewCount ?? 0),
    payout: Number(body.payout ?? body.earnings ?? 0),
    createdAt: body.createdAt,
  };
}

export function normalizeSubmissionList(raw: unknown): Submission[] {
  return asList(raw, ["submissions"]).map(normalizeSubmission);
}

export function normalizeCreatorEarnings(raw: unknown): CreatorEarnings {
  const body = unwrapData<{
    totalEarnings?: number;
    earnings?: number;
    total?: number;
    submissions?: unknown[];
  }>(raw);

  const submissions = normalizeSubmissionList(
    body.submissions ?? asList(raw, ["submissions"])
  );

  const totalFromFields = body.totalEarnings ?? body.earnings ?? body.total;
  const totalEarnings =
    totalFromFields != null
      ? Number(totalFromFields)
      : submissions.reduce((sum, item) => sum + item.payout, 0);

  return { totalEarnings, submissions };
}
