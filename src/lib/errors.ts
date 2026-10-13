import type { ApiError } from "@/types";

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as ApiError).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
