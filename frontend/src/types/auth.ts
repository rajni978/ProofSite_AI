export const USER_ROLES = [
  "ADMIN",
  "SUBCONTRACTOR",
  "SUPERVISOR",
  "WORKER",
] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = "ACTIVE" | "DISABLED";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUserResponse {
  user: AuthUser;
}

export interface AuthSessionResponse extends AuthUserResponse {
  token: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
  };
}

export interface RegistrationRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
