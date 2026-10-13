export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const TOKEN_KEY = "memed_token";
export const USER_KEY = "memed_user";

export const PLATFORMS = ["Instagram", "YouTube"] as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  brand: "/brand",
  creator: "/creator",
} as const;

/** Central API paths — change here if backend routes differ */
export const ENDPOINTS = {
  auth: {
    signup: "/api/auth/signup",
    login: "/api/auth/login",
  },
  campaigns: {
    list: "/api/campaigns",
    create: "/api/campaigns",
    mine: "/api/campaigns/mine",
  },
  submissions: {
    create: "/api/submissions",
    mine: "/api/submissions/mine",
    updateViews: (id: string) => `/api/submissions/${id}/views`,
  },
  creator: {
    earnings: "/api/creator/earnings",
  },
} as const;
