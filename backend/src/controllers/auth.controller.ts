import type { RequestHandler } from "express";
import { User } from "../models/user.model";
import { parseLoginInput, parseRegistrationInput } from "../middleware/validate-auth";
import { signAuthToken } from "../utils/jwt";
import { ApiError } from "../utils/api-error";

function toPublicUser(user: {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  organizationId?: { toString(): string } | null;
  onboardingStatus: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    organizationId: user.organizationId?.toString() ?? null,
    onboardingStatus: user.onboardingStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const register: RequestHandler = async (request, response) => {
  const input = parseRegistrationInput(request.body);
  const user = await User.create({
    ...input,
    role: "WORKER",
  });

  response.status(201).json({
    user: toPublicUser(user),
    token: signAuthToken(user.id),
  });
};

export const login: RequestHandler = async (request, response) => {
  const input = parseLoginInput(request.body);
  const user = await User.findOne({ email: input.email }).select("+password");
  const passwordMatches = user
    ? await user.comparePassword(input.password)
    : false;

  if (!user || !passwordMatches || user.status !== "ACTIVE") {
    throw new ApiError(401, "Invalid email or password");
  }

  response.status(200).json({
    user: toPublicUser(user),
    token: signAuthToken(user.id),
  });
};

export const getCurrentUser: RequestHandler = async (request, response) => {
  const authUser = request.authUser;
  if (!authUser) {
    throw new ApiError(401, "Authentication is required");
  }

  const user = await User.findById(authUser.userId);
  if (!user || user.status !== "ACTIVE") {
    throw new ApiError(401, "Invalid or expired token");
  }

  response.status(200).json({ user: toPublicUser(user) });
};
