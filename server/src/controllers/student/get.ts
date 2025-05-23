import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";
import { serializeBigint, studentInclude } from ".";
import { Prisma } from "@prisma/client";

export async function getStudents(req: Request, res: Response): Promise<void> {
  try {
    const { skip, examId, take, q, year } = req.query;

    const where: Prisma.StudentWhereInput = {};

    where.Enrollment = {
      some: {
        examId: typeof examId === "string" ? examId : undefined,
        year: typeof year === "string" ? parseInt(year, 10) : undefined,
      },
    };

    if (typeof q === "string") {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { contactNumber: { equals: parseInt(q) || 0 } },
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
