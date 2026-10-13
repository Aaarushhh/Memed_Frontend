import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { normalizeAuthResponse } from "@/lib/normalize";
import type { AuthResponse, LoginPayload, SignupPayload } from "@/types";

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const raw = await api.post(ENDPOINTS.auth.signup, payload, { auth: false });
  return normalizeAuthResponse(raw);
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const raw = await api.post(ENDPOINTS.auth.login, payload, { auth: false });
  return normalizeAuthResponse(raw);
}
