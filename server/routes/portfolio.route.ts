import { Router } from "express";
import {
  getPortfolio,
  postPortfolio,
} from "../controllers/portfolio.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";

export const portfolioRouter = Router();

portfolioRouter.get(
  "/:uid",
  [authControl("resource-read", "uid")],
  getPortfolio
);
portfolioRouter.post(
  "/:uid",
  [authControl("resource-write", "uid")],
  postPortfolio
);
