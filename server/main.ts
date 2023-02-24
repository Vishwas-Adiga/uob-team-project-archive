import express from "express";
import { authRouter } from "./routes/auth.route.js";
import { Config } from "./configs/config.js";
import { serveHTML, serveStatic } from "./middleware/vite.middleware.js";
import { getHealth } from "./services/user.service.js";

const app = express();

app.use("/api/v1/auth", authRouter);
app.get("/api/v1", async (_req, res) => {
  const health = await getHealth();
  res.status(200).json({ message: health });
});

app.listen(Config.PORT, async () => {
  await serveStatic(app);
  await serveHTML(app);
  console.log(`App running in port ${Config.PORT}`);
});
