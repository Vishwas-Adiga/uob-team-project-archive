import { NextFunction, Request, Response } from "express";

// TODO: Use something more robust like jsconschema
// https://www.npmjs.com/package/jsonschema
export const ensurePayload =
  (keys?: string[]) => (req: Request, res: Response, next: NextFunction) => {
    // Reject if payload is empty
    if (!Object.keys(req.body).length) {
      return res.status(400).send({ message: "Cannot process empty body" });
    }

    // Reject if not all keys in payload
    if (
      !keys?.reduce(
        (p, k) => p && Object.keys(req.body).indexOf(k) !== -1,
        true
      )
    ) {
      return res.status(400).send({
        message: `Invalid request body. Must contain ${keys?.join(", ")}`,
      });
    }
    next();
  };
