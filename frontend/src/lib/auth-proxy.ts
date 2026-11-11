import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  USER_ROLES,
  type AuthUser,
  type UserRole,
  type UserStatus,
} from "@/types/auth";

export const AUTH_COOKIE_NAME = "proofsite_session";
const AUTH_COOKIE_MAX_AGE = 60 * 60;

type JsonRecord = Record<string, unknown>;

function isOnboardingStatus(
  value: unknown,
): value is AuthUser["onboardingStatus"] {
  return value === "NOT_REQUIRED" ||
    value === "NOT_STARTED" ||
    value === "IN_PROGRESS" ||
    value === "COMPLETED";
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" &&
    USER_ROLES.includes(value as UserRole);
}

function isUserStatus(value: unknown): value is UserStatus {
  return value === "ACTIVE" || value === "DISABLED";
}

export function parseAuthUser(value: unknown): AuthUser | null {
  if (!isRecord(value)) return null;

  const {
    id,
    fullName,
    email,
    role,
    status,
    organizationId,
    onboardingStatus,
    createdAt,
    updatedAt,
  } = value;
  if (
    typeof id !== "string" ||
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    !isUserRole(role) ||
    !isUserStatus(status) ||
    (organizationId !== null && typeof organizationId !== "string") ||
    !isOnboardingStatus(onboardingStatus) ||
    typeof createdAt !== "string" ||
    typeof updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id,
    fullName,
    email,
    role,
    status,
    organizationId,
    onboardingStatus,
    createdAt,
    updatedAt,
  };
}

export async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getApiBaseUrl(): URL | null {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (process.env.NODE_ENV === "production" && url.protocol !== "https:")
    ) {
      return null;
    }

    url.pathname = url.pathname.replace(/\/+$/, "");
    return url;
  } catch {
    return null;
  }
}

export function getBackendAuthUrl(endpoint: "register" | "login" | "me"): string | null {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return null;
  return new URL(`${baseUrl.pathname}/auth/${endpoint}`, baseUrl).toString();
}

export function getBackendOnboardingUrl(
  endpoint: "root" | "draft" | "complete",
): string | null {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return null;
  const suffix = endpoint === "root" ? "" : `/${endpoint}`;
  return new URL(`${baseUrl.pathname}/onboarding${suffix}`, baseUrl).toString();
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function authError(
  status: number,
  message: string,
): NextResponse {
  return NextResponse.json({ error: { message } }, { status });
}

function backendErrorMessage(payload: unknown, fallback: string): string {
  if (!isRecord(payload) || !isRecord(payload.error)) return fallback;
  const message = payload.error.message;
  return typeof message === "string" && message.length > 0 && message.length <= 240
    ? message
    : fallback;
}

function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function proxyCredentialRequest(
  request: Request,
  endpoint: "register" | "login",
): Promise<NextResponse> {
  if (!isSameOriginRequest(request)) {
    return authError(403, "Request origin could not be verified");
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return authError(400, "A valid JSON request body is required");
  }

  if (!isRecord(requestBody)) {
    return authError(400, "A valid JSON request body is required");
  }

  const body =
    endpoint === "register"
      ? {
          fullName: requestBody.fullName,
          email: requestBody.email,
          password: requestBody.password,
        }
      : {
          email: requestBody.email,
          password: requestBody.password,
        };
  const backendUrl = getBackendAuthUrl(endpoint);
  if (!backendUrl) {
    return authError(503, "Authentication service is not configured");
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return authError(502, "Unable to reach the authentication service");
  }

  const payload = await readJson(backendResponse);
  if (!backendResponse.ok) {
    const status = backendResponse.status >= 400 && backendResponse.status < 500
      ? backendResponse.status
      : 502;
    return authError(status, backendErrorMessage(payload, "Authentication request failed"));
  }

  if (!isRecord(payload)) {
    return authError(502, "Authentication service returned an invalid response");
  }
  const user = parseAuthUser(payload.user);
  const token = payload.token;
  if (
    !user ||
    user.status !== "ACTIVE" ||
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 4096
  ) {
    return authError(502, "Authentication service returned an invalid response");
  }

  const response = NextResponse.json({ user }, { status: backendResponse.status });
  setAuthCookie(response, token);
  return response;
}

export async function getServerCurrentUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const backendUrl = getBackendAuthUrl("me");
  if (!backendUrl) return null;

  try {
    const response = await fetch(backendUrl, {
      headers: { authorization: `Bearer ${token}`, accept: "application/json" },
      cache: "no-store",
      redirect: "manual",
    });
    if (!response.ok) return null;

    const payload = await readJson(response);
    if (!isRecord(payload)) return null;
    const user = parseAuthUser(payload.user);
    return user?.status === "ACTIVE" ? user : null;
  } catch {
    return null;
  }
}
