import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";
import { serializeBigint, studentInclude } from ".";
import { Prisma } from "@prisma/client";

export async function getStudents(req: Request, res: Response): Promise<void> {
  try {
    const { skip, examId, take, q } = req.query;

    const where: Prisma.StudentWhereInput = {};
    if (typeof examId === "string") {
      where.Enrollment = {
        some: {
          examId,
        },
      };
    }

    if (typeof q === "string") {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { state: { contains: q, mode: "insensitive" } },
        { fatherName: { contains: q, mode: "insensitive" } },
      ];
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
