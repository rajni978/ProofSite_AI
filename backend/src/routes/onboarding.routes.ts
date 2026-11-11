import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { authorizeRoles } from "../middleware/authorize-roles";
import {
  completeOnboarding,
  getOnboarding,
  saveOnboardingDraft,
} from "../controllers/onboarding.controller";

export const onboardingRouter = Router();

onboardingRouter.use(authenticate, authorizeRoles("ADMIN"));
onboardingRouter.get("/", getOnboarding);
onboardingRouter.put("/draft", saveOnboardingDraft);
onboardingRouter.post("/complete", completeOnboarding);
