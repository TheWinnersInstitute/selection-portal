import { Router } from "express";
import { checkReturnPayload } from "../middleware/checkRequestPayload";
import { z } from "zod";
import { adminLogin } from "../controllers/admin";

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
