import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import { authRouter } from "./routes/auth.route.js";
import { userRouter } from "./routes/user.route.js";
import { Config } from "./configs/config.js";
import { serveHTML, serveStatic } from "./middleware/vite.middleware.js";
import { Accommodation, Course, Module, sequelize } from "./models/index.js";
import { widgetsRouter } from "./routes/widgets.route.js";
import { portfolioRouter } from "./routes/portfolio.route.js";
import { userConnectionsRouter } from "./routes/user-connections.route.js";
import { userRequestsRouter } from "./routes/user-request.route.js";
import { recommendationsRouter } from "./routes/recommendations.route.js";
import { getCommonModel } from "./controllers/common-models.controller.js";
import { seed } from "./seeders/index.js";
import { graphRouter } from "./routes/graph.route.js";
import { searchRouter } from "./routes/search.route.js";

const app = express();
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/widgets", widgetsRouter);
app.use("/api/v1/portfolios", portfolioRouter);
app.use("/api/v1/connections", userConnectionsRouter);
app.use("/api/v1/requests", userRequestsRouter);
app.use("/api/v1/recommendations", recommendationsRouter);
app.use("/api/v1/graph", graphRouter);
app.use("/api/v1/search", searchRouter);

app.get("/api/v1/courses", getCommonModel(Course));
app.get("/api/v1/accommodations", getCommonModel(Accommodation));
app.get("/api/v1/modules", getCommonModel(Module));

app.listen(Config.PORT, async () => {
  await serveStatic(app);
  await serveHTML(app);
  await sequelize.sync();
  const seeded = (await Module.count()) !== 0;
  if (!seeded) await seed();
  console.log(`App running in port ${Config.PORT}`);
});
