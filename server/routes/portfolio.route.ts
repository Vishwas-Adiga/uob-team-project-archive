import { Router } from "express";
import {
  getPortfolio,
  postPortfolio,
} from "../controllers/portfolio.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

export const portfolioRouter = Router();

portfolioRouter.get("/:pid", getPortfolio);
portfolioRouter.post("/:pid", [verifyToken], postPortfolio);
