export type UserRole = "brand" | "creator";

export type Platform = "Instagram" | "YouTube";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/** Matches backend milestone shape: `{ views, payout }` */
export interface Milestone {
  views: number;
  payout: number;
}

export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  totalBudget: number;
  budgetSpent: number;
  budgetRemaining: number;
  milestones: Milestone[];
  brandId: string;
  createdAt?: string;
}

export interface Submission {
  id: string;
  campaignId: string;
  creatorId: string;
  postUrl: string;
  views: number;
  payout: number;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateCampaignPayload {
  name: string;
  platform: Platform;
  totalBudget: number;
  milestones: Milestone[];
}

export interface SubmitPostPayload {
  campaignId: string;
  postUrl: string;
}

export interface CreatorEarnings {
  totalEarnings: number;
  submissions: Submission[];
}

export interface ApiError {
  message: string;
  status?: number;
}
