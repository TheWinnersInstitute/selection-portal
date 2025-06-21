import { Router } from "express";
import {
  getUserAssets,
  createUserAsset,
  deleteUserAsset,
} from "../controllers/user";
import { checkAccess, checkAuth, checkRequestPayload } from "../middleware";
import { z } from "zod";
import { S3 } from "../lib";

export const userRoutes = Router();

userRoutes.get(
  "/assets",
  checkAuth,
  checkAccess("user", "read"),
  getUserAssets
);
userRoutes.post(
  "/assets",
  checkAuth,
  checkAccess("user", "create"),
  checkRequestPayload(
    z.object({
      userId: z.string(),
    })
  ),
  S3.instance.uploadFile.single("file"),
  createUserAsset
);
userRoutes.delete(
  "/assets/:id",
  checkAuth,
  checkAccess("user", "delete"),
  checkRequestPayload(
    z.object({
      id: z.string(),
    }),
    "params"
  ),
  deleteUserAsset
);
