import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function deleteStudent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.student.delete({
      where: { id },
    });
    res.status(200).json({
      message: "success",
      data: [],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
