import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function updateExam(req: Request, res: Response): Promise<void> {
  try {
    const { id, description, examDate, boardId, name } = req.body;
    const updatedExam = await prisma.exam.update({
      where: {
        id,
      },
      data: {
        description,
        examDate,
        name,
        boardId,
      },
    });
    res.status(200).json({
      message: "success",
      data: [updatedExam],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
