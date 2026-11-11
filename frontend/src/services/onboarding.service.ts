import { apiRequest } from "./api";
import type {
  CompleteOnboardingResponse,
  GetOnboardingResponse,
  OnboardingDraftRequest,
  SaveOnboardingDraftResponse,
} from "@/types/onboarding";

export function getOnboarding(): Promise<GetOnboardingResponse> {
  return apiRequest<GetOnboardingResponse>("/api/onboarding");
}

export function saveOnboardingDraft(
  input: OnboardingDraftRequest,
): Promise<SaveOnboardingDraftResponse> {
  return apiRequest<SaveOnboardingDraftResponse>("/api/onboarding", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function completeOnboarding(): Promise<CompleteOnboardingResponse> {
  return apiRequest<CompleteOnboardingResponse>("/api/onboarding/complete", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
