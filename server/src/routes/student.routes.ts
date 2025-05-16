import { Router } from "express";
import {
  createStudent,
  createStudents,
  deleteStudent,
  getStudents,
  updateStudent,
  downloadErroredData,
  queueStatus,
  getStudentAssets,
  createStudentAsset,
  deleteStudentAsset,
} from "../controllers/student";
import { checkReturnPayload, checkAccess, checkAuth } from "../middleware";
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
  checkAccess("student", "read"),
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
  checkAccess("student", "create"),
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
  checkAccess("student", "delete"),
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
  checkAccess("student", "update"),
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
  checkAccess("student", "create"),
  studentBulkUpload.single("file"),
  createStudents
);

studentRoutes.get(
  "/bulk-error",
  checkAuth,
  checkAccess("student", "read"),
  downloadErroredData
);
studentRoutes.get(
  "/bulk",
  checkAuth,
  checkAccess("student", "read"),
  downloadStudentsExcel
);
studentRoutes.get(
  "/bulk/status",
  checkAuth,
  checkAccess("student", "read"),
  queueStatus
);

studentRoutes.post(
  "/enrollment",
  checkAuth,
  checkAccess("enrollment", "create"),
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
      selectionIn: z.string().optional(),
      examId: z.string({ message: "Exam is required" }).uuid(),
      examCategoryId: z
        .string({ message: "Exam is required" })
        .uuid()
        .optional(),
      year: z.string().optional(),
    })
  ),
  createEnrollment
);
studentRoutes.delete(
  "/enrollment/:id",
  checkAuth,
  checkAccess("enrollment", "delete"),
  checkReturnPayload(
    z.object({
      id: z.string().uuid(),
    }),
    "params"
  ),
  deleteEnrollment
);

studentRoutes.get(
  "/assets/:id",
  checkAuth,
  checkAccess("student", "read"),
  checkReturnPayload(
    z.object({
      id: z.string(),
    }),
    "params"
  ),
  getStudentAssets
);
studentRoutes.post(
  "/assets",
  checkAuth,
  checkAccess("student", "create"),
  S3.instance.uploadFile.array("files", 10),
  checkReturnPayload(
    z.object({
      userId: z.string(),
    })
  ),
  createStudentAsset
);
studentRoutes.delete(
  "/assets/:id",
  checkAuth,
  checkAccess("student", "delete"),
  checkReturnPayload(
    z.object({
      id: z.string(),
    }),
    "params"
  ),
  deleteStudentAsset
);
