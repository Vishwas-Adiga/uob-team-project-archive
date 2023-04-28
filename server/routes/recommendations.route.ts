import { Router } from "express";
import { getRecommendations } from "../controllers/recommendations.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";

export const recommendationsRouter = Router();

recommendationsRouter.get(
  "/",
  [authControl("self", "uid")],
  getRecommendations
);
