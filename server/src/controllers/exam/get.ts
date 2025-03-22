import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function getExams(req: Request, res: Response): Promise<void> {
  try {
    const { boardId } = req.query;
    const exams = await prisma.exam.findMany({
      where: {
        ...(typeof boardId === "string" ? { boardId } : {}),
      },
    });

    res.status(200).json({
      message: "success",
      data: exams,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
