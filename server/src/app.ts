import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { CronJob } from "cron";
import cors from "cors";

import { authRoutes, boardRoutes, examRoutes, studentRoutes } from "./routes";
import { RedisClient, S3, seed } from "./lib";
import { adminRoutes } from "./routes/admin.routes";
import { userRoutes } from "./routes/user.routes";

async function main() {
  const PORT = process.env.PORT;
  const app = express();

  await seed();

  RedisClient.Instance;
  S3.instance;
  app.use(cors());

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use((req, res, next) => {
    req.setTimeout(600000);
    next();
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/board", boardRoutes);
  app.use("/api/exam", examRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/user", userRoutes);

  S3.instance.backup();

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

main();
