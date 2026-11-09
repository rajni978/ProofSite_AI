import { ApiError } from "../utils/api-error";

export interface RegistrationInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function getObjectBody(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ApiError(400, "Request body must be a JSON object");
  }
  return value as Record<string, unknown>;
}

function parseEmail(value: unknown): string {
  if (typeof value !== "string") {
    throw new ApiError(400, "A valid email address is required");
  }

  const email = value.trim().toLowerCase();
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new ApiError(400, "A valid email address is required");
  }

  return email;
}

function parsePassword(value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length < 8 ||
    Buffer.byteLength(value, "utf8") > 72
  ) {
    throw new ApiError(400, "Password must be 8 or more characters and at most 72 bytes");
  }
  return value;
}

export function parseRegistrationInput(value: unknown): RegistrationInput {
  const body = getObjectBody(value);
  const fullName = body.fullName;
  if (
    typeof fullName !== "string" ||
    fullName.trim().length < 2 ||
    fullName.trim().length > 100
  ) {
    throw new ApiError(400, "Full name must be between 2 and 100 characters");
  }

  return {
    fullName: fullName.trim(),
    email: parseEmail(body.email),
    password: parsePassword(body.password),
  };
}

export function parseLoginInput(value: unknown): LoginInput {
  const body = getObjectBody(value);
  if (typeof body.password !== "string" || body.password.length === 0) {
    throw new ApiError(400, "Email and password are required");
  }
  if (Buffer.byteLength(body.password, "utf8") > 72) {
    throw new ApiError(400, "Password must not exceed 72 bytes");
  }

  return {
    email: parseEmail(body.email),
    password: body.password,
  };
}
