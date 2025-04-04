import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function createRole(req: Request, res: Response) {
  try {
    const { name, board, enrollment, exam, student } = req.body;

    const role = await prisma.role.create({
      data: {
        name,
        board,
        enrollment,
        exam,
        student,
      },
    });
    res.json({
      message: "success",
      data: [role],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
