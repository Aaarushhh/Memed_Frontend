import { API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";
import type { ApiError } from "@/types";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

/** Success: `{ data, message }` → returns `data`. Error: `{ error }`. */
async function request<T>(
  path: string,
  { body, auth = true, headers, ...rest }: RequestOptions = {}
): Promise<T> {
  const token = auth ? getToken() : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const errBody = json as { error?: string } | null;
    const error: ApiError = {
      message: errBody?.error || "Something went wrong",
      status: response.status,
    };
    throw error;
  }

  if (json && typeof json === "object" && "data" in json) {
    return (json as { data: T }).data;
  }

  return json as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
};

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as ApiError).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
