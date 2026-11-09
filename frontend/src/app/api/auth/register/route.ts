import { proxyCredentialRequest } from "@/lib/auth-proxy";

export function POST(request: Request) {
  return proxyCredentialRequest(request, "register");
}
