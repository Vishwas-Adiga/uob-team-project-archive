import { Router } from "express";
import {
  addConnection,
  deleteConnection,
  getConnections,
  requestConnection,
  updateConnections,
} from "../controllers/user-connection.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";

export const userRequestsRouter = Router();
userRequestsRouter.get(
  "/",
  [authControl("self", "uid")],
  getConnections(false)
);

userRequestsRouter.post("/", [authControl("self", "uid")], addConnection);
userRequestsRouter.post(
  "/:uid",
  [authControl("self", "uid")],
  requestConnection
);

userRequestsRouter.patch(
  "/:uid",
  [authControl("self", "uid")],
  updateConnections
);

userRequestsRouter.delete(
  "/:uid",
  [authControl("self", "uid")],
  deleteConnection
);
