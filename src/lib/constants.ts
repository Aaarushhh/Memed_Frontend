export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const TOKEN_KEY = "memed_token";
export const USER_KEY = "memed_user";

import type { Platform, UserRole } from "@/types";

export const ROLES: readonly UserRole[] = ["brand", "creator"];
export const PLATFORMS: readonly Platform[] = ["Instagram", "YouTube"];

export const DEFAULT_ROLE: UserRole = "creator";
export const DEFAULT_PLATFORM: Platform = "Instagram";

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

export function dashboardRoute(role: UserRole) {
  return role === "brand" ? ROUTES.brand : ROUTES.creator;
}
