import type { RequestHandler } from "express";
import type { UserRole } from "../models/user.model";
import { ApiError } from "../utils/api-error";

export function authorizeRoles(...allowedRoles: UserRole[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.authUser) {
      return next(new ApiError(401, "Authentication is required"));
    }

    if (!allowedRoles.includes(request.authUser.role)) {
      return next(new ApiError(403, "You do not have permission to access this resource"));
    }

    return next();
  };
}
