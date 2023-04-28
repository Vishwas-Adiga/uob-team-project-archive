import { Router } from "express";
import { getGraphConnections } from "../controllers/graph.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";

export const graphRouter = Router();

graphRouter.get("/", [authControl("self", "uid")], getGraphConnections);
