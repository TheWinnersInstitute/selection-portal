import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function getStudents(req: Request, res: Response): Promise<void> {
  try {
    const { skip } = req.query;
    const students = await prisma.student.findMany({
      skip: typeof skip === "string" ? parseInt(skip, 10) : 0,
      take: 25,
    });

    res.status(200).json({
      message: "success",
      data: students,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
