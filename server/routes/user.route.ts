import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { authControl } from "../middleware/jwt.middleware.js";

export const userRouter = Router();

userRouter.get("/:uid", [authControl("resource-write", "uid")], getUser);
userRouter.delete("/:uid", [authControl("resource-write", "uid")], deleteUser);
userRouter.get("/", [authControl("admin")], getUsers);
userRouter.patch("/:uid", [authControl("resource-write", "uid")], updateUser);
