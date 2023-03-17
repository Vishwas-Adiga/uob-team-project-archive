import { Router } from "express";
import { getBioWidget } from "../controllers/widgets.controller.js";
import { getLocationWidgets } from "../controllers/widgets.controller.js";

//TODO Verify token for widgets when database is done:

export const widgetsRouter = Router();

widgetsRouter.get("/rich-text", getBioWidget);
widgetsRouter.get("/location", getLocationWidgets);
