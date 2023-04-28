import { Router } from "express";
import { getSearchResult } from "../controllers/search.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";

export const searchRouter = Router();

searchRouter.get("/", [authControl("self", "uid")], getSearchResult);
