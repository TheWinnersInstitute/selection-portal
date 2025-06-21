import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function createRole(req: Request, res: Response) {
  try {
    const { name, board, enrollment, exam, student, luckyDraw, role, user } =
      req.body;

    const createdRole = await prisma.role.create({
      data: {
        name,
        board,
        enrollment,
        exam,
        student,
        luckyDraw,
        role,
        user,
      },
    });
    res.json({
      message: "success",
      data: [createdRole],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
