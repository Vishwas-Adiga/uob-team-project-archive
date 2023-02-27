import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";
import { ensurePayload } from "../middleware/ensure-payload.middleware.js";

export const authRouter = Router();

authRouter.post(
  "/sign-up",
  [ensurePayload(["email", "password1", "password2"])],
  signUp
);
authRouter.post("/sign-in", [ensurePayload(["email", "password"])], signIn);
