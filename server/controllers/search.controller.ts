import { Response } from "express";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { User } from "../models/index.js";
import { Op } from "sequelize";

export const getSearchResult = async (req: ValidatedRequest, res: Response) => {
  const query = req.query.query as string;
  const result = await User.findAll({
    where: {
      name: {
        [Op.substring]: query,
      },
    },
    attributes: {
      include: ["name", "profilePicture", "userId"],
    },
  });
  return res.status(200).send(result);
};
