import { Response } from "express";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { User } from "../models/index.js";

export const getUser = async (req: ValidatedRequest, res: Response) => {
  const user = await User.findByPk(req.resourceOwnerId, {
    attributes: ["userId", "email"],
  });
  if (!user) {
    return res.status(404).send();
  }

  return res.status(200).send({ ...user.dataValues, admin: req.admin });
};

export const deleteUser = async (req: ValidatedRequest, res: Response) => {
  const user = await User.findByPk(req.resourceOwnerId);
  if (!user) {
    return res.status(404).send();
  }
  await user.destroy();
  return res.status(200).send();
};

export const getUsers = async (req: ValidatedRequest, res: Response) => {
  const users = await User.findAll({ attributes: ["userId", "email"] });
  return res.status(200).send(users);
};
