import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";
import { serializeBigint, studentInclude } from ".";
import { Prisma } from "@prisma/client";

export async function getStudents(req: Request, res: Response): Promise<void> {
  try {
    const { skip, examId, take } = req.query;

    const where: Prisma.StudentWhereInput = {};
    if (typeof examId === "string") {
      where.Enrollment = {
        some: {
          examId,
        },
      };
    }

    const total = await prisma.student.count({
      where,
    });

    const students = await prisma.student.findMany({
      skip: typeof skip === "string" ? parseInt(skip, 10) : 0,
      take: parseInt((take as string) || "25"),
      include: studentInclude,
      where,
    });

    res.status(200).json({
      message: "success",
      data: students.map((student) => {
        return serializeBigint(student);
      }),
      total,
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
