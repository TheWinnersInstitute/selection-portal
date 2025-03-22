import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "../controllers/student";
import { checkAuth } from "../middleware/checkAuth";
import { checkAdmin } from "../middleware/checkAdmin";
import { checkReturnPayload } from "../middleware/checkRequestPayload";
import { z } from "zod";
import { upload } from "../lib/s3";

export const studentRoutes = Router();
studentRoutes.get(
  "/",
  checkReturnPayload(
    z.object({
      skip: z.string().max(4).optional(),
      take: z.string().max(4).optional(),
    }),
    "query"
  ),
  getStudents
);

studentRoutes.post(
  "/",
  checkAuth,
  checkAdmin,
  upload.single("file"),
  checkReturnPayload(
    z.object({
      name: z.string().max(100).min(1),
      email: z.string().email().max(100).min(1),
      city: z.string().max(100).min(1).optional(),
      contactNumber: z.string().max(100).min(1).optional(),
      dateOfBirth: z.string().max(100).min(1).optional(),
      fatherName: z.string().max(100).min(1).optional(),
      state: z.string().max(100).min(1).optional(),
      postAllotment: z.string().max(100).min(1).optional(),
    })
  ),
  createStudent
);

studentRoutes.delete(
  "/:id",
  checkAuth,
  checkAdmin,
  checkReturnPayload(
    z.object({
      id: z.string().uuid(),
    }),
    "params"
  ),
  deleteStudent
);

studentRoutes.patch(
  "/",
  checkAuth,
  checkAdmin,
  upload.single("file"),
  checkReturnPayload(
    z.object({
      id: z.string().uuid(),
      name: z.string().max(100).min(1),
      email: z.string().email().max(100).min(1),
      city: z.string().max(100).min(1).optional(),
      contactNumber: z.string().max(100).min(1).optional(),
      dateOfBirth: z.string().max(100).min(1).optional(),
      fatherName: z.string().max(100).min(1).optional(),
      state: z.string().max(100).min(1).optional(),
      postAllotment: z.string().max(100).min(1).optional(),
    })
  ),
  updateStudent
);
