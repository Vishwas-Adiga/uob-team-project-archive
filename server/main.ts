import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.route.js";
import { userRouter } from "./routes/user.route.js";
import { Config } from "./configs/config.js";
import { serveHTML, serveStatic } from "./middleware/vite.middleware.js";
import { sequelize } from "./models/index.js";
import { widgetsRouter } from "./routes/widgets.route.js";
import { portfolioRouter } from "./routes/portfolio.route.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/v1", async (_req, res) => {
  // I'm a teapot
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
  res.status(418).send();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/widgets", widgetsRouter);
app.use("/api/v1/portfolios", portfolioRouter);

app.listen(Config.PORT, async () => {
  await serveStatic(app);
  await serveHTML(app);
  await sequelize.sync();
  console.log(`App running in port ${Config.PORT}`);
});
