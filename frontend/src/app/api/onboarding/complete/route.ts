import { proxyOnboardingRequest } from "@/lib/onboarding-proxy";

export function POST(request: Request) {
  return proxyOnboardingRequest(request, "complete", "POST");
}
