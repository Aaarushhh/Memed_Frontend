import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { mapEarnings, mapSubmission } from "@/lib/map";
import type { CreatorEarnings, Submission, SubmitPostPayload } from "@/types";

export async function submitPost(
  payload: SubmitPostPayload
): Promise<Submission> {
  const data = await api.post<{
    submission: Parameters<typeof mapSubmission>[0];
  }>(ENDPOINTS.submissions.create, payload);
  return mapSubmission(data.submission);
}

export async function getMyEarnings(): Promise<CreatorEarnings> {
  const data = await api.get(ENDPOINTS.submissions.earnings);
  return mapEarnings(data as { totalEarnings?: number });
}
