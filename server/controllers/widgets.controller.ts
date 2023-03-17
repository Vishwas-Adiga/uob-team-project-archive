import { Response } from "express";
import { RichText } from "../models/richtext.model.js";
import { AuthenticatedRequest } from "../middleware/jwt.middleware.js";
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
