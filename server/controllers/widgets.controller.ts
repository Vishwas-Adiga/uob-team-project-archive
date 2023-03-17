import { Response } from "express";
import { RichText } from "../models/richtext.model.js";
import { AuthenticatedRequest } from "../middleware/jwt.middleware.js";
import { Location } from "../models/location.model.js";

export const getBioWidget = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const richText = await RichText.findAll({
    where: {
      user: req.body.userId,
    },
  });
  return res.status(200).send({
    richText,
  });
};

export const getLocationWidgets = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const location = await Location.findAll({
    where: {
      user: req.body.userId,
    },
  });
  if (!location) {
    return res.status(404).send();
  }
  return res.status(200).send(location);
};
