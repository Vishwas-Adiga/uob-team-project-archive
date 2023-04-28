import { Router } from "express";
import {
  deleteConnection,
  getConnections,
} from "../controllers/user-connection.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";

export const userConnectionsRouter = Router();
userConnectionsRouter.get(
  "/",
  [authControl("self", "uid")],
  getConnections(true)
);
userConnectionsRouter.delete(
  "/:uid",
  [authControl("self", "uid")],
  deleteConnection
);
