import { Router } from "express";
import {
  addBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "../controllers/banner";
import { checkAccess, checkAuth, checkRequestPayload } from "../middleware";
import { z } from "zod";
import { assetUpload, S3 } from "../lib";

export const bannerRoutes = Router();

bannerRoutes.get("/", getBanners);
bannerRoutes.post(
  "/",
  checkAuth,
  checkAccess("banner", "create"),
  S3.instance.uploadBanner.single("file"),
  checkRequestPayload(
    z.object({
      name: z.string({ message: "Name is required" }),
      link: z.string().optional(),
      sequence: z.string({ message: "Sequence is required" }),
    }),
    "body"
  ),
  addBanner
);

bannerRoutes.patch(
  "/",
  checkAuth,
  checkAccess("banner", "update"),
  S3.instance.uploadBanner.single("file"),
  checkRequestPayload(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      link: z.string().optional(),
      sequence: z.string(),
    }),
    "body"
  ),
  updateBanner
);

bannerRoutes.delete(
  "/:id",
  checkAuth,
  checkAccess("banner", "delete"),
  checkRequestPayload(
    z.object({
      id: z.string().uuid(),
    }),
    "params"
  ),
  deleteBanner
);
