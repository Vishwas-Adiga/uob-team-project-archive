import { Response } from "express";
import { RichText } from "../models/richtext.model.js";
import { AuthenticatedRequest } from "../middleware/jwt.middleware.js";
import { Location } from "../models/location.model.js";

export const getBioWidget = async (
  req: AuthenticatedRequest,
  res: Response
) => {};

export const getLocationWidgets = async (
  req: AuthenticatedRequest,
  res: Response
) => {};
