import { Router } from "express";
import {
  createExam,
  deleteExam,
  getExams,
  updateExam,
} from "../controllers/exam";
import { checkRequestPayload, checkAccess, checkAuth } from "../middleware";
import { z } from "zod";
import {
  createExamCategory,
  deleteExamCategory,
} from "../controllers/exam/category";

export const examRoutes = Router();

examRoutes.get("/", getExams);
examRoutes.post(
  "/",
  checkAuth,
  checkAccess("exam", "create"),
  checkRequestPayload(
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
  checkRequestPayload(
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
  checkRequestPayload(
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

examRoutes.post(
  "/category",
  checkAuth,
  checkAccess("exam", "create"),
  checkRequestPayload(
    z.object({
      name: z.string().max(100).min(1),
      examId: z.string().uuid(),
    })
  ),
  createExamCategory
);

examRoutes.delete(
  "/category/:id",
  checkAuth,
  checkAccess("exam", "delete"),
  checkRequestPayload(
    z.object({
      id: z.string().uuid(),
    }),
    "params"
  ),
  deleteExamCategory
);
