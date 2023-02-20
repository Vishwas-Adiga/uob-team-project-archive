import { Router } from "express";

export const authRouter = Router();
authRouter.get("/sign-up", (req, res) => {
  // I'm a teapot
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
  res.status(418).send();
});
