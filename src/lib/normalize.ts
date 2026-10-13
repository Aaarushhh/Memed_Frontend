import type { AuthResponse, User, UserRole } from "@/types";

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
