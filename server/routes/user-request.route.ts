import { Router } from "express";
import {
  deleteConnection,
  getConnections,
  updateConnections,
} from "../controllers/user-connection.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";

export const userRequestsRouter = Router();
userRequestsRouter.get(
  "/",
  [authControl("self", "uid")],
  getConnections(false)
);
userRequestsRouter.post(
  "/:uid",
  [authControl("self", "uid")],
  updateConnections
);
userRequestsRouter.delete(
  "/:uid",
  [authControl("self", "uid")],
  deleteConnection
);
