import { NextResponse } from "next/server";
import {
  clearAuthCookie,
  isSameOriginRequest,
} from "@/lib/auth-proxy";

export function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: { message: "Request origin could not be verified" } },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ message: "Signed out successfully" });
  clearAuthCookie(response);
  return response;
}
