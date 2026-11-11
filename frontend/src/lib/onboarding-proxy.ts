import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  authError,
  getBackendOnboardingUrl,
  isSameOriginRequest,
  readJson,
} from "@/lib/auth-proxy";

type OnboardingEndpoint = "root" | "draft" | "complete";
type OnboardingMethod = "GET" | "PUT" | "POST";

export async function proxyOnboardingRequest(
  request: Request,
  endpoint: OnboardingEndpoint,
  method: OnboardingMethod,
): Promise<NextResponse> {
  if (method !== "GET" && !isSameOriginRequest(request)) {
    return authError(403, "Request origin could not be verified");
  }

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return authError(401, "Authentication is required");

  const backendUrl = getBackendOnboardingUrl(endpoint);
  if (!backendUrl) return authError(503, "Onboarding service is not configured");

  let body: string | undefined;
  if (method !== "GET") {
    try {
      body = await request.text();
    } catch {
      return authError(400, "A valid JSON request body is required");
    }
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(backendUrl, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/json",
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body } : {}),
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return authError(502, "Unable to reach the onboarding service");
  }

  const payload = await readJson(backendResponse);
  if (payload === null) {
    return authError(502, "Onboarding service returned an invalid response");
  }

  return NextResponse.json(payload, { status: backendResponse.status });
}
