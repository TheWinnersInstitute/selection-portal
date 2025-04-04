import { Router } from "express";
import {
  createExam,
  deleteExam,
  getExams,
  updateExam,
} from "../controllers/exam";
import { checkReturnPayload, checkAccess, checkAuth } from "../middleware";
import { z } from "zod";

export const examRoutes = Router();

examRoutes.get("/", getExams);
examRoutes.post(
  "/",
  checkAuth,
  checkAccess("exam", "create"),
  checkReturnPayload(
    z.object({
      name: z.string().max(100).min(1),
      description: z.string().max(1000).optional(),
      examDate: z.string().datetime(),
      boardId: z.string().uuid(),
    })
  ),
  createExam
);
examRoutes.delete(
  "/:id",
  checkAuth,
  checkAccess("exam", "delete"),
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
  checkAccess("exam", "update"),
  checkReturnPayload(
    z.object({
      id: z.string().uuid(),
      name: z.string().max(100).min(1),
      description: z.string().max(1000).optional(),
      examDate: z.string().datetime(),
      boardId: z.string().uuid(),
    })
  ),
  updateExam
);
