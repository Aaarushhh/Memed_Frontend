import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { normalizeAuthResponse, normalizeUser } from "@/lib/normalize";
import type { AuthResponse, LoginPayload, SignupPayload, User } from "@/types";

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const raw = await api.post(ENDPOINTS.auth.signup, payload, { auth: false });
  return normalizeAuthResponse(raw);
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const raw = await api.post(ENDPOINTS.auth.login, payload, { auth: false });
  return normalizeAuthResponse(raw);
}

export async function getMe(): Promise<User> {
  const raw = await api.get(ENDPOINTS.auth.me);
  const body =
    raw && typeof raw === "object" && "data" in raw
      ? (raw as { data: unknown }).data
      : raw;
  const user =
    body && typeof body === "object" && "user" in body
      ? (body as { user: unknown }).user
      : body;
  return normalizeUser(user as Parameters<typeof normalizeUser>[0]);
}
