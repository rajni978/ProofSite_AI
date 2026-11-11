import { proxyOnboardingRequest } from "@/lib/onboarding-proxy";

export function GET(request: Request) {
  return proxyOnboardingRequest(request, "root", "GET");
}

export function PUT(request: Request) {
  return proxyOnboardingRequest(request, "draft", "PUT");
}
