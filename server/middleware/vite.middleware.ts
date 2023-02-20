import express from "express";
import core from "express-serve-static-core";
import fetch from "node-fetch";
import path from "path";
import { Config } from "../configs/config.js";

const { NODE_ENV } = process.env;
const PRODUCTION_ENV = NODE_ENV === "production";
const VITE_HOST = `http://localhost:${Config.VITE_PORT}`;
const isStaticFilePath = (path: string) => path.match(/\.\w+$/);

export const serveStatic = async (app: core.Express) => {
  if (PRODUCTION_ENV) {
    app.use(express.static(process.cwd()));
  } else {
    app.use((req, res, next) => {
      if (isStaticFilePath(req.path)) {
        fetch(`${VITE_HOST}${req.path}`).then(response => {
          if (!response.ok) return next();
          res.redirect(response.url);
        });
      } else next();
    });
  }

  const layer = app._router.stack.pop();
  app._router.stack = [
    ...app._router.stack.slice(0, 2),
    layer,
    ...app._router.stack.slice(2),
  ];
};

export const serveHTML = async (app: core.Express) => {
  if (PRODUCTION_ENV) {
    app.use("*", (_, res) => {
      res.sendFile(path.resolve(process.cwd(), "index.html"));
    });
  } else {
    app.get("/*", async (req, res, next) => {
      if (isStaticFilePath(req.path)) return next();

      fetch(VITE_HOST)
        .then(res => res.text())
        .then(content =>
          content.replace(
            /(\/@react-refresh|\/@vite\/client)/g,
            `${VITE_HOST}$1`
          )
        )
        .then(content => res.header("Content-Type", "text/html").send(content));
    });
  }
};
