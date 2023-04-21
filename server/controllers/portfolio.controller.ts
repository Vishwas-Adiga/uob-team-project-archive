import { Request, Response } from "express";
import { RichText, Location, User } from "../models/index.js";
import { AuthenticatedRequest } from "../middleware/jwt.middleware.js";

export const getPortfolio = async (req: Request, res: Response) => {
  // portfolio IDs are simply user IDs
  // this makes sense because portfolio info is simply a subset of user info
  const portfolioId = parseInt(req.params.pid);
  if (isNaN(portfolioId)) return res.status(404).send();

  const user = await User.findByPk(portfolioId);
  if (!user)
    return res.status(404).send({ message: "No portfolio found for given ID" });
  // TODO allow accessing private portfolios if authenticated && user in connections
  if (user.privacy !== "Public")
    return res
      .status(403)
      .send({ message: "Access to private portfolio forbidden" });

  // TODO remove delay
  // Adding a temporary delay to give the illusion of computationally expensive
  // processes running in the server
  // Nifty UX tricks ftw
  await new Promise((res, _rej) => setTimeout(res, 800));

  const portfolio = {
    name: user.name,
    profilePicture: user.profilePicture,
    profileBanner: user.profileBanner,
  };

  return res.status(200).send(portfolio);
};

// TODO remove this backdoor
// was put in place to remotely edit portfolios and widgets for M2
export const postPortfolio = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.admin) return res.status(403).send();

  const portfolioId = parseInt(req.params.pid);
  const user = await User.findByPk(portfolioId);

  if (!user) return res.status(404).send();

  user.name = req.body.user?.name ?? user.name;
  user.profileBanner = req.body.user?.profileBanner ?? user.profileBanner;
  user.profilePicture = req.body.user?.profilePicture ?? user.profilePicture;
  await user.save();

  res.status(200).send();
};
