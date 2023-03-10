import { Router } from "express";
import {getWidget} from "../controllers/widgets.controller.js";


//TODO Verify token for widgets when database is done:

export const widgetsRouter = Router();

widgetsRouter.get("/:uid", getWidget);