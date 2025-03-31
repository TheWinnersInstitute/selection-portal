import { Router } from "express";
import {
  createStudent,
  createStudents,
  deleteStudent,
  getStudents,
  updateStudent,
  downloadErroredData,
  queueStatus,
} from "../controllers/student";
import { checkAuth } from "../middleware/checkAuth";
import { checkAdmin } from "../middleware/checkAdmin";
import { checkReturnPayload } from "../middleware/checkRequestPayload";
import { z } from "zod";
import { S3, studentBulkUpload } from "../lib/s3";
import { downloadStudentsExcel } from "../controllers/student/download";
import {
  createEnrollment,
  deleteEnrollment,
} from "../controllers/student/enrollment";

export const studentRoutes = Router();
studentRoutes.get(
  "/",
  checkAuth,
  checkAdmin,
  checkReturnPayload(
    z.object({
      skip: z.string().max(5).optional(),
      take: z.string().max(5).optional(),
      examId: z.string().optional(),
      q: z.string().max(100).optional(),
    }),
    "query"
  ),
  getStudents
);

studentRoutes.post(
  "/",
  checkAuth,
  checkAdmin,
  S3.instance.uploadFile.single("file"),
  checkReturnPayload(
    z.object({
      name: z.string().max(100).min(1),
      email: z.string().optional(),
      city: z.string().max(100).optional(),
      contactNumber: z.string().max(100).optional(),
      dateOfBirth: z.string().optional(),
      fatherName: z.string().max(100).optional(),
      state: z.string().max(100).optional(),
      postAllotment: z.string().max(100).optional(),
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
  S3.instance.uploadFile.single("file"),
  checkReturnPayload(
    z.object({
      id: z.string().uuid(),
      name: z.string().max(100).min(1),
      email: z.string().optional(),
      city: z.string().max(100).optional(),
      contactNumber: z.string().max(100).optional(),
      dateOfBirth: z.string().optional(),
      fatherName: z.string().max(100).optional(),
      state: z.string().max(100).optional(),
      postAllotment: z.string().max(100).optional(),
    })
  ),
  updateStudent
);

studentRoutes.post(
  "/bulk",
  checkAuth,
  checkAdmin,
  studentBulkUpload.single("file"),
  createStudents
);

studentRoutes.get("/bulk-error", checkAuth, checkAdmin, downloadErroredData);
studentRoutes.get("/bulk", checkAuth, checkAdmin, downloadStudentsExcel);
studentRoutes.get("/bulk/status", checkAuth, checkAdmin, queueStatus);

studentRoutes.post(
  "/enrollment",
  checkAuth,
  checkAdmin,
  S3.instance.uploadResult.single("file"),
  checkReturnPayload(
    z.object({
      studentId: z.string({ message: "Student is required" }).uuid(),
      post: z.string({ message: "Post is required" }).max(100).min(1),
      rollNumber: z
        .string({ message: "Roll number is required" })
        .max(100)
        .min(1),
      rank: z.string().optional(),
      examId: z.string({ message: "Exam is required" }).uuid(),
    })
  ),
  createEnrollment
);
studentRoutes.delete(
  "/enrollment/:id",
  checkAuth,
  checkAdmin,
  checkReturnPayload(
    z.object({
      id: z.string().uuid(),
    }),
    "params"
  ),
  deleteEnrollment
);
