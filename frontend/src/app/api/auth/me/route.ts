import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  authError,
  clearAuthCookie,
  getBackendAuthUrl,
  parseAuthUser,
  readJson,
} from "@/lib/auth-proxy";

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return authError(401, "Authentication is required");

  const backendUrl = getBackendAuthUrl("me");
  if (!backendUrl) return authError(503, "Authentication service is not configured");

  let backendResponse: Response;
  try {
    backendResponse = await fetch(backendUrl, {
      headers: { authorization: `Bearer ${token}`, accept: "application/json" },
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return authError(502, "Unable to reach the authentication service");
  }

  const payload = await readJson(backendResponse);
  if (backendResponse.status === 401) {
    const response = authError(401, "Your session has expired. Please sign in again.");
    clearAuthCookie(response);
    return response;
  }
  if (!backendResponse.ok) {
    return authError(
      backendResponse.status >= 400 && backendResponse.status < 500
        ? backendResponse.status
        : 502,
      "Unable to verify your current session",
    );
  }
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("user" in payload)
  ) {
    return authError(502, "Authentication service returned an invalid response");
  }

  const user = parseAuthUser(payload.user);
  if (!user || user.status !== "ACTIVE") {
    const response = authError(502, "Authentication service returned an invalid response");
    clearAuthCookie(response);
    return response;
  }

  return NextResponse.json({ user });
}
