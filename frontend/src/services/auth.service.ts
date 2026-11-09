import { apiRequest } from "./api";
import type {
  AuthUserResponse,
  LoginRequest,
  RegistrationRequest,
} from "@/types/auth";

export function register(input: RegistrationRequest): Promise<AuthUserResponse> {
  return apiRequest<AuthUserResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: LoginRequest): Promise<AuthUserResponse> {
  return apiRequest<AuthUserResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getCurrentUser(): Promise<AuthUserResponse> {
  return apiRequest<AuthUserResponse>("/api/auth/me");
}

export function logout(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/auth/logout", {
    method: "POST",
  });
}
