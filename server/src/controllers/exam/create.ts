import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function createExam(req: Request, res: Response): Promise<void> {
  try {
    const { description, examDate, name, boardId } = req.body;
    const exam = await prisma.exam.create({
      data: {
        description,
        examDate,
        name,
        boardId,
        // @ts-ignore
        userId: req.session.userId,
        examStatus: "pending",
      },
    });
    res.status(200).json({
      message: "Exam created successfully",
      data: [exam],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
