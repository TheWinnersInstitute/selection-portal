import { Router } from "express";
import { checkReturnPayload } from "../middleware/checkRequestPayload";
import { z } from "zod";
import { adminLogin, getAsset, logout } from "../controllers/admin";
import { checkAuth } from "../middleware/checkAuth";

export const adminRoutes = Router();
adminRoutes.post(
  "/login",
  checkReturnPayload(
    z.object({
      email: z.string(),
      password: z.string(),
    })
  ),
  adminLogin
);

adminRoutes.get(
  "/assets/:id",
  checkReturnPayload(
    z.object({
      id: z.string(),
    }),
    "params"
  ),
  getAsset
);

adminRoutes.get("/logout", checkAuth, logout);
