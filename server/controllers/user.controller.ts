import { Response } from "express";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { Accommodation, Course, User } from "../models/index.js";

export const getUser = async (req: ValidatedRequest, res: Response) => {
  const user = await User.findByPk(req.resourceOwnerId, {
    attributes: ["userId", "email"],
    include: [
      {
        model: Accommodation,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Course,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
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

export const updateUser = async (req: ValidatedRequest, res: Response) => {
  const user = await User.findByPk(req.resourceOwnerId);
  if (!user) {
    return res.status(404).send();
  }

  const { name, email, privacy, course, accommodation } = req.body;
  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.privacy = privacy ?? user.privacy;
  user.course = course.courseId ?? user.course;
  user.accommodation = accommodation.accommId ?? user.accommodation;

  await user.save();

  return res.status(200).send({ message: "User updated successfully" });
};
