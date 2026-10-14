import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { mapAuth } from "@/lib/map";
import type { AuthResponse, LoginPayload, SignupPayload } from "@/types";

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const data = await api.post(ENDPOINTS.auth.signup, payload, { auth: false });
  return mapAuth(data as Parameters<typeof mapAuth>[0]);
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const data = await api.post(ENDPOINTS.auth.login, payload, { auth: false });
  return mapAuth(data as Parameters<typeof mapAuth>[0]);
}
