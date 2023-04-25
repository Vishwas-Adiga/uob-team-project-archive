import { Response, Request } from "express";
import { User } from "../models/index.js";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";

export const getPortfolio = async (req: ValidatedRequest, res: Response) => {
  const user = await User.findByPk(req.resourceOwnerId);
  if (!user)
    return res.status(404).send({ message: "No portfolio found for given ID" });

  const portfolio = {
    name: user.name,
    profilePicture: user.profilePicture,
    profileBanner: user.profileBanner,
  };

  return res.status(200).send(portfolio);
};

export const getPortfolioHeader = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.uid, 10);
  if (!userId) {
    return res.status(400).send();
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).send();
  }
  return res.status(200).send({
    name: user.name,
    profilePicture: user.profilePicture,
    profileBanner: user.profileBanner,
  });
};

export const postPortfolio = async (req: ValidatedRequest, res: Response) => {
  const user = await User.findByPk(req.resourceOwnerId);

  if (!user) return res.status(404).send();

  user.name = req.body.user?.name ?? user.name;
  user.profileBanner = req.body.user?.profileBanner ?? user.profileBanner;
  user.profilePicture = req.body.user?.profilePicture ?? user.profilePicture;
  await user.save();

  res.status(200).send();
};
