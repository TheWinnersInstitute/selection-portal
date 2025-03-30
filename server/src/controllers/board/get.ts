import { Request, Response } from "express";
import { prisma, RedisClient } from "../../lib";

export async function getBoards(req: Request, res: Response) {
  try {
    const boards = await prisma.board.findMany({
      include: {
        exams: true,
      },
    });

    const examIds = boards.flatMap((board) =>
      board.exams.map((exam) => exam.id)
    );

    const enrollments = await prisma.enrollment.groupBy({
      by: ["examId"],
      _count: {
        id: true,
      },
      where: {
        examId: {
          in: examIds,
        },
      },
    });

    const enrollmentMap = enrollments.reduce((acc, curr) => {
      acc[curr.examId] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    const boardsWithEnrollmentCount = boards.map(
      ({ exams, ...boardWithoutExams }) => {
        const enrollmentCount = exams.reduce(
          (sum, exam) => sum + (enrollmentMap[exam.id] || 0),
          0
        );

        return {
          ...boardWithoutExams,
          enrollmentCount,
        };
      }
    );

    res.status(200).json({
      message: "success",
      data: boardsWithEnrollmentCount,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: error.message,
      });
  }
}
