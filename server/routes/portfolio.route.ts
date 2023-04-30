import { Router } from "express";
import {
  getPortfolio,
  getPortfolioHeader,
  getProfileBanner,
  getProfilePicture,
  postPortfolio,
  uploadProfileBanner,
  uploadProfilePicture,
} from "../controllers/portfolio.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";
import { getAllWidgets } from "../controllers/widgets.controller.js";

export const portfolioRouter = Router();

portfolioRouter.get(
  "/:uid",
  [authControl("resource-read", "uid")],
  getPortfolio
);
portfolioRouter.get(
  "/:uid/widgets",
  [authControl("resource-read", "uid")],
  getAllWidgets
);
portfolioRouter.get("/:uid/header", getPortfolioHeader);
portfolioRouter.get("/:uid/profile-picture", getProfilePicture);
portfolioRouter.post(
  "/profile-picture",
  [authControl("self", "uid")],
  uploadProfilePicture
);
portfolioRouter.get("/:uid/profile-banner", getProfileBanner);
portfolioRouter.post(
  "/profile-banner",
  [authControl("self", "uid")],
  uploadProfileBanner
);
portfolioRouter.post(
  "/:uid",
  [authControl("resource-write", "uid")],
  postPortfolio
);
