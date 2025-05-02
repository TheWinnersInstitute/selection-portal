import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function getExams(req: Request, res: Response): Promise<void> {
  try {
    const { boardId } = req.query;
    const exams = await prisma.exam.findMany({
      where: {
        ...(typeof boardId === "string" ? { boardId } : {}),
      },
      include: {
        ExamCategory: true,
      },
    });

    const examIds = exams.map((exam) => exam.id);

    const enrollments = await prisma.enrollment.groupBy({
      by: ["examId"],
      _count: { id: true },
      where: {
        examId: { in: examIds },
      },
    });

    const enrollmentMap = Object.fromEntries(
      enrollments.map(({ examId, _count }) => [examId, _count.id])
    );

    res.status(200).json({
      message: "success",
      data: exams.map((exam) => {
        return {
          id: exam.id,
          name: exam.name,
          description: exam.description,
          examDate: exam.examDate,
          boardId: exam.boardId,
          examCategories: exam.ExamCategory,
          enrollmentCount: enrollmentMap[exam.id] || 0,
        };
      }),
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
