import { Router } from "express";
import {
  getCurrentUser,
  login,
  register,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, getCurrentUser);
