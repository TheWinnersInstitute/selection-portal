import { Router } from "express";
import {
  createExam,
  deleteExam,
  getExams,
  updateExam,
} from "../controllers/exam";
import { checkAuth } from "../middleware/checkAuth";
import { checkAdmin } from "../middleware/checkAdmin";
import { checkReturnPayload } from "../middleware/checkRequestPayload";
import { z } from "zod";

export const examRoutes = Router();

examRoutes.get("/", getExams);
examRoutes.post(
  "/",
  checkAuth,
  checkAdmin,
  checkReturnPayload(
    z.object({
      name: z.string().max(100).min(1),
      description: z.string().max(1000).min(5),
      examDate: z.date(),
      boardId: z.string().uuid(),
    })
  ),
  createExam
);
examRoutes.delete(
  "/:id",
  checkAuth,
  checkAdmin,
  checkReturnPayload(
    z.object({
      id: z.string().uuid(),
    }),
    "params"
  ),
  deleteExam
);

examRoutes.patch(
  "/",
  checkAuth,
  checkAdmin,
  checkReturnPayload(
    z.object({
      id: z.string().uuid(),
      name: z.string().max(100).min(1),
      description: z.string().max(1000).min(5),
      examDate: z.date(),
      boardId: z.string().uuid(),
    })
  ),
  updateExam
);
