import { Request, Response } from "express";
import { prisma } from "../../../lib";

export async function createExamCategory(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, examId } = req.body;
    const examCategory = await prisma.examCategory.create({
      data: {
        name,
        examId,
      },
    });

    res.status(200).json({
      message: "Exam category created successfully",
      data: [examCategory],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
