import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthConfig } from "../configs/auth.config.js";

/**
 * Request data with additional payload attached by auth middleware
 * Every request that requires authentication must be of this type
 */
export interface AuthenticatedRequest extends Request {
  userId: number;
  admin: boolean;
}

/**
 * Payload encoded in the JWT issued by the app
 */
interface Payload extends JwtPayload {
  id: number;
  admin: boolean;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Token passed as an authorisation bearer
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).send();
  }

  const rx = /^(Bearer) ([A-Za-z0-9-_.]*)$/;
  const token = rx.exec(header)?.[2] || "";
  jwt.verify(token, AuthConfig.JWT_SECRET, (err, payload: Payload) => {
    if (err) {
      return res.status(401).send();
    }
    req.userId = payload.id;
    req.admin = payload.admin;
    next();
  });
};
