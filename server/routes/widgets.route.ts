import { Router } from "express";
import { authControl } from "../middleware/jwt.middleware.js";
import {
  createWidget,
  deleteWidget,
  getWidget,
  getAllWidgets,
  updateWidget,
} from "../controllers/widgets.controller.js";

export const widgetsRouter = Router();

widgetsRouter.get("/", [authControl("self", "uid")], getAllWidgets);
widgetsRouter.get("/:wid", [authControl("resource-read", "wid")], getWidget);
widgetsRouter.post("/", [authControl("self", "uid")], createWidget);
widgetsRouter.patch(
  "/:wid",
  [authControl("resource-write", "wid")],
  updateWidget
);
widgetsRouter.delete(
  "/:wid",
  [authControl("resource-write", "wid")],
  deleteWidget
);
