import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/api-error";

const SAFE_ERROR_TYPES = new Set([
  "Error",
  "MongoNetworkError",
  "MongoParseError",
  "MongoServerError",
  "MongooseError",
  "ValidationError",
]);
const SAFE_ERROR_CODES = new Set([
  "EAI_AGAIN",
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
]);

function getSafeErrorMetadata(error: unknown): {
  errorType: string;
  errorCode: number | string;
  category: string;
} {
  const errorType =
    error instanceof Error && SAFE_ERROR_TYPES.has(error.name)
      ? error.name
      : "UnknownError";
  const rawCode =
    typeof error === "object" && error !== null && "code" in error
      ? error.code
      : undefined;
  const errorCode =
    typeof rawCode === "number" && Number.isInteger(rawCode)
      ? rawCode
      : typeof rawCode === "string" && SAFE_ERROR_CODES.has(rawCode)
        ? rawCode
        : "unknown";
  const category =
    errorCode === 18 || errorCode === 8000
      ? "authentication"
      : errorCode === "ENOTFOUND" || errorCode === "EAI_AGAIN"
        ? "dns"
        : errorType === "MongoParseError"
          ? "invalid-connection-string"
          : errorCode === "ECONNREFUSED" ||
              errorCode === "ECONNRESET" ||
              errorCode === "ETIMEDOUT" ||
              errorType === "MongoNetworkError"
            ? "network"
            : errorType === "ValidationError"
              ? "validation"
              : "api";

  return { errorType, errorCode, category };
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({ error: { message: error.message } });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    response.status(400).json({ error: { message: "Request validation failed" } });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    response.status(409).json({ error: { message: "An account with this email already exists" } });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 400
  ) {
    response.status(400).json({ error: { message: "Invalid request body" } });
    return;
  }

  console.error("Unhandled API error", getSafeErrorMetadata(error));
  response.status(500).json({ error: { message: "Internal server error" } });
};
