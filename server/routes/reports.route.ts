import { Router } from "express";
import {
  createReport,
  getReportById,
  getAllReports,
} from "../controllers/reports.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";

export const reportsRouter = Router();

reportsRouter.post("/:uid", [authControl("self", "uid")], createReport);
reportsRouter.get("/:id", [authControl("admin")], getReportById);
reportsRouter.get("/", [authControl("admin")], getAllReports);
