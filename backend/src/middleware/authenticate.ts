import type { RequestHandler } from "express";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import { ApiError } from "../utils/api-error";
import { verifyAuthToken } from "../utils/jwt";

export const authenticate: RequestHandler = async (request, _response, next) => {
  const authorization = request.header("authorization");
  const match = authorization?.match(/^Bearer ([^\s]+)$/i);
  if (!match) {
    return next(new ApiError(401, "Authentication is required"));
  }

  let userId: string;
  try {
    userId = verifyAuthToken(match[1]);
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }

  if (!mongoose.isValidObjectId(userId)) {
    return next(new ApiError(401, "Invalid or expired token"));
  }

  const user = await User.findById(userId);
  if (!user || user.status !== "ACTIVE") {
    return next(new ApiError(401, "Invalid or expired token"));
  }

  request.authUser = { userId: user.id, role: user.role };
  return next();
};
