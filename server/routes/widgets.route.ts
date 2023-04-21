import { Router } from "express";
import { authControl } from "../middleware/jwt.middleware.js";
import { getWidget } from "../controllers/widgets.controller.js";

export const widgetsRouter = Router();

widgetsRouter.get("/:wid", [authControl("resource-read", "wid")], getWidget);
