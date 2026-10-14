export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

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

export const ENDPOINTS = {
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
  },
  campaigns: {
    root: "/campaigns",
    live: "/campaigns/live",
  },
  submissions: {
    create: "/submissions",
    earnings: "/submissions/earnings",
  },
} as const;

export function dashboardRoute(role: "brand" | "creator") {
  return role === "brand" ? ROUTES.brand : ROUTES.creator;
}
