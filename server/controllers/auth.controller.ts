import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ValidationError } from "sequelize";
import { User } from "../models/index.js";
import { AuthConfig } from "../configs/auth.config.js";

export const signUp = async (req: Request, res: Response) => {
  if (req.body.password1 !== req.body.password2) {
    return res.status(400).send({ message: "Passwords do not match" });
  }

  const hash = await bcrypt.hash(req.body.password1, AuthConfig.SALT_ROUNDS);

  try {
    await User.create({
      email: req.body.email.replaceAll("+admin", ""),
      password: hash,
      // TODO require name on sign up
      name: "Placeholder",
    });
    return res.status(200).send();
  } catch (e) {
    if (e instanceof ValidationError) {
      // ValidationError can be any of:
      // - Duplicate account (UNIQUE constraint failure)
      // - Empty fields (NOT NULL constraint failure)
      return res
        .status(400)
        .send({ message: e.errors.map(ei => ei.message).join("\n") });
    }
    return res.status(500).send();
  }
};
export const signIn = async (req: Request, res: Response) => {
  // Any user who signs in with their regular email with "+admin" appended to
  // their username (part preceding @) is granted admin rights
  // TODO: Restrict admins to specific email addresses
  const admin = req.body.email.includes("+admin");
  const email = req.body.email.replaceAll("+admin", "");
  const user = await User.findOne({
    where: {
      email,
    },
  });

  const authenticated = await bcrypt.compare(
    req.body.password,
    user?.password ?? ""
  );
  if (!authenticated || !user) {
    return res.status(401).send({ message: "Email or password incorrect" });
  }

  // If authenticated, issue a JWT token
  const token = jwt.sign({ id: user.userId, admin }, AuthConfig.JWT_SECRET, {
    expiresIn: AuthConfig.JWT_EXPIRY,
  });

  return res.status(200).send({
    id: user.userId,
    token,
  });
};
