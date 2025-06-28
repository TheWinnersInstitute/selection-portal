import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import {
  authRoutes,
  boardRoutes,
  examRoutes,
  studentRoutes,
  adminRoutes,
  userRoutes,
  luckyDrawRoutes,
  bannerRoutes,
} from "./routes";
import { RedisClient, S3, seed } from "./lib";

async function main() {
  const PORT = process.env.PORT;
  const app = express();

  await seed();

  RedisClient.Instance;
  S3.instance;
  app.use(cors());

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // var accessLogStream = fs.createWriteStream(
  //   path.join(__dirname, "access.log"),
  //   { flags: "a" }
  // );

  app.use(morgan("dev"));

  app.use((req, res, next) => {
    req.setTimeout(600000);
    next();
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/banner", bannerRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/board", boardRoutes);
  app.use("/api/exam", examRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/lucky-draw", luckyDrawRoutes);

  S3.instance.backup();

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

main();
