import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthConfig } from "../configs/auth.config.js";
import { User, UserConnection, Widget } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Request data with additional payload attached by auth middleware
 * Every request that requires authentication must be of this type
 */
export interface ValidatedRequest extends Request {
  resourceRequesterId?: number;
  resourceOwnerId?: number;
  admin: boolean;
}

/**
 * Payload encoded in the JWT issued by the app
 */
interface Payload extends JwtPayload {
  id: number;
  admin: boolean;
}

export type AuthMode = "self" | "resource-write" | "resource-read" | "admin";
export type ExtractMode = "uid" | "wid";

const extractUid = async (
  req: ValidatedRequest,
  mode: ExtractMode
): Promise<number> => {
  if (mode === "uid") {
    return parseInt(req.params.uid, 10) || Promise.reject("User ID invalid");
  } else {
    // wid
    const wid = parseInt(req.params.wid, 10);
    if (!wid) {
      return Promise.reject("Widget ID invalid");
    }
    const entry = await Widget.findByPk(wid);
    if (entry === null) {
      return Promise.reject("Widget ID non-existent");
    }
    return entry.user;
  }
};

export const authControl =
  (mode: AuthMode, uidMode?: ExtractMode) =>
  async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    req.admin = false;
    // Token passed as an authorisation bearer
    const header = req.headers["authorization"];

    if (mode === "resource-read" && !header) {
      if (uidMode === undefined) {
        throw new Error("Cannot request resource auth with no extractor");
      }
      try {
        req.resourceOwnerId = await extractUid(req, uidMode);
      } catch (error) {
        return res.status(400).send(error);
      }
      const user = await User.findByPk(req.resourceOwnerId);
      if (user === null) {
        return res.status(403).send();
      }
      if (user.privacy === "Public") {
        return next();
      } else {
        return res.status(403).send();
      }
    }

    if (!header) {
      return res.status(401).send();
    }

    const rx = /^(Bearer) ([A-Za-z0-9-_.]*)$/;
    const token = rx.exec(header)?.[2] || "";
    jwt.verify(token, AuthConfig.JWT_SECRET, async (err, payload: Payload) => {
      if (err) {
        return res.status(401).send();
      }
      req.resourceRequesterId = payload.id;
      req.admin = payload.admin;

      if (mode === "admin") {
        if (!req.admin) {
          return res.status(403).send();
        } else {
          return next();
        }
      }

      if (mode === "self" || req.admin) {
        return next();
      }
      if (uidMode === undefined) {
        throw new Error("Cannot request resource auth with no extractor");
      }
      try {
        req.resourceOwnerId = await extractUid(req, uidMode);
      } catch (error) {
        return res.status(400).send(error);
      }
      if (req.resourceRequesterId === req.resourceOwnerId) {
        return next();
      } else if (mode === "resource-write") {
        return res.status(403).send();
      }
      const user = await User.findByPk(req.resourceOwnerId);
      if (user === null) {
        return res.status(403).send();
      }
      if (user.privacy === "Public" || user.privacy === "Local") {
        next();
      } else {
        // private
        const entry = await UserConnection.findOne({
          where: {
            accepted: { [Op.not]: null },
            [Op.or]: {
              [Op.and]: [
                { dstUserId: req.resourceOwnerId },
                { srcUserId: req.resourceRequesterId },
              ],
              [Op.and]: [
                { dstUserId: req.resourceRequesterId },
                { srcUserId: req.resourceOwnerId },
              ],
            },
          },
        });
        if (entry === null) {
          return res.status(403).send();
        }
        return next();
      }
    });
  };
