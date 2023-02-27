import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

export const userRouter = Router();

userRouter.get("/:uid", [verifyToken], getUser);
userRouter.delete("/:uid", [verifyToken], deleteUser);
userRouter.get("/", [verifyToken], getUsers);
