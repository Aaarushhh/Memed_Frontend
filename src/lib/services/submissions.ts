import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import {
  normalizeCreatorEarnings,
  normalizeSubmission,
} from "@/lib/normalize";
import type { CreatorEarnings, Submission, SubmitPostPayload } from "@/types";

export async function submitPost(
  payload: SubmitPostPayload
): Promise<Submission> {
  const raw = await api.post(ENDPOINTS.submissions.create, payload);
  return normalizeSubmission(raw);
}

/** Creator: GET /submissions/earnings → `{ totalEarnings }` */
export async function getMyEarnings(): Promise<CreatorEarnings> {
  const raw = await api.get(ENDPOINTS.submissions.earnings);
  return normalizeCreatorEarnings(raw);
}

/** No auth — simulates platform view updates */
export async function updateSubmissionViews(
  submissionId: string,
  views: number
): Promise<Submission> {
  const raw = await api.patch(
    ENDPOINTS.submissions.updateViews(submissionId),
    { views },
    { auth: false }
  );
  return normalizeSubmission(raw);
}
