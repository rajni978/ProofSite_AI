export interface OnboardingAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface OnboardingCompany {
  companyName: string;
  businessEmail: string;
  phone: string;
  address: OnboardingAddress;
}

export interface OnboardingContact {
  name: string;
  designation: string;
}

export interface OnboardingProject {
  name: string;
  siteAddress: string;
  location: string;
  startDate: string;
  endDate: string;
}

export type OnboardingStep = "company" | "contact" | "firstProject" | "review";

export interface OnboardingDraft {
  status: "IN_PROGRESS" | "COMPLETED";
  currentStep: OnboardingStep;
  company: OnboardingCompany | null;
  contact: OnboardingContact | null;
  firstProject: OnboardingProject | null;
}

export type OnboardingDraftRequest =
  | { step: "company"; data: OnboardingCompany }
  | { step: "contact"; data: OnboardingContact }
  | { step: "firstProject"; data: OnboardingProject };

export interface GetOnboardingResponse {
  onboarding: OnboardingDraft | null;
}

export interface SaveOnboardingDraftResponse {
  onboarding: OnboardingDraft;
}

export interface CompleteOnboardingResponse {
  onboarding: { status: "COMPLETED" };
  organization: { id: string };
  project: { id: string; name: string };
}
