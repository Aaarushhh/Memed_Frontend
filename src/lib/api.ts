import { API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";
import type { ApiError } from "@/types";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

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

  if (!response.ok) {
    let message = "Something went wrong";
    try {
      const data = (await response.json()) as {
        message?: string;
        error?: string;
        errors?: Array<string | { message?: string }>;
      };
      // Backend error shape: `{ success: false, error }`
      if (typeof data.error === "string" && data.error.trim()) {
        message = data.error;
      } else if (data.message) {
        message = data.message;
      } else if (Array.isArray(data.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        message = typeof first === "string" ? first : first.message ?? message;
      }
    } catch {
      // ignore non-JSON error bodies
    }
    const error: ApiError = { message, status: response.status };
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
