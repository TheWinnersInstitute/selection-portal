import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { authRoutes, boardRoutes, examRoutes, studentRoutes } from "./routes";
import { RedisClient, seed } from "./lib";
import { adminRoutes } from "./routes/admin.routes";

dotenv.config();

async function main() {
  const PORT = process.env.PORT;
  const app = express();

  await seed();

  RedisClient.Instance;
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));

  app.use((req, res, next) => {
    req.setTimeout(600000);
    next();
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/board", boardRoutes);
  app.use("/api/exam", examRoutes);
  app.use("/api/student", studentRoutes);

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

main();
