import { Response, Request } from "express";
import { User } from "../models/index.js";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { v4 as uuidv4 } from "uuid";

export const getPortfolio = async (req: ValidatedRequest, res: Response) => {
  const user = await User.findByPk(req.resourceOwnerId);
  if (!user)
    return res.status(404).send({ message: "No portfolio found for given ID" });

  const portfolio = {
    name: user.name,
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

export const getProfilePicture = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.uid, 10);
  if (!userId) {
    return res.status(400).send();
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).send();
  }
  const profilePicture = await user.getProfilePicture();
  let relPath;
  if (profilePicture) {
    relPath = profilePicture.relPath;
  } else {
    relPath = "assets/default/profile_picture.png";
  }
  res.status(200).sendFile(relPath, {
    root: process.cwd(),
    headers: { "Content-Disposition": "inline", "Content-Type": "image/png" },
  });
};

export const getProfileBanner = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.uid, 10);
  if (!userId) {
    return res.status(400).send();
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).send();
  }
  const profileBanner = await user.getProfileBanner();
  let relPath;
  if (profileBanner) {
    relPath = profileBanner.relPath;
  } else {
    relPath = "assets/default/profile_banner.jpg";
  }
  res.status(200).sendFile(relPath, {
    root: process.cwd(),
    headers: { "Content-Disposition": "inline", "Content-Type": "image/png" },
  });
};

export const uploadProfilePicture = async (
  req: ValidatedRequest,
  res: Response
) => {
  if (!req.files?.file) {
    return res.status(400).send();
  }
  const user = await User.findByPk(req.resourceRequesterId);
  if (!user) {
    return res.status(404).send();
  }
  const profilePicture = await user.getProfilePicture();
  if (profilePicture) {
    profilePicture.destroy();
  }
  const path = `assets/uploaded/${uuidv4()}`;
  await req.files.file.mv(path);
  await user.createProfilePicture({ name: "profile_picture", relPath: path });

  res.status(200).send();
};

export const uploadProfileBanner = async (
  req: ValidatedRequest,
  res: Response
) => {
  if (!req.files?.file) {
    return res.status(400).send();
  }
  const user = await User.findByPk(req.resourceRequesterId);
  if (!user) {
    return res.status(404).send();
  }
  const profileBanner = await user.getProfileBanner();
  if (profileBanner) {
    profileBanner.destroy();
  }
  const path = `assets/uploaded/${uuidv4()}`;
  await req.files.file.mv(path);
  await user.createProfileBanner({ name: "profile_banner", relPath: path });

  res.status(200).send();
};
