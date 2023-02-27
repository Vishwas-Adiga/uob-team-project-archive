import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/jwt.middleware.js";
import { User } from "../models/index.js";

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = parseInt(req.params.uid);
  // Disallow accessing other users if not authenticated as admin
  if (!req.admin && userId !== req.userId) {
    return res.status(403).send();
  }

  const user = await User.findByPk(userId, { attributes: ["id", "email"] });
  if (!user) {
    return res.status(404).send();
  }

  return res.status(200).send({ ...user, admin: req.admin });
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = parseInt(req.params.uid);
  // Disallow deleting other users unless admin
  if (!req.admin && userId !== req.userId) {
    return res.status(403).send();
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).send();
  }
  await user.destroy();
  return res.status(200).send();
};

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.admin) {
    return res.status(403).send();
  }

  const users = await User.findAll({ attributes: ["id", "email"] });
  return res.status(200).send(users);
};
