import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function updateRole(req: Request, res: Response) {
  try {
    const {
      id,
      name,
      board,
      enrollment,
      exam,
      student,
      role,
      user,
      luckyDraw,
      banner,
    } = req.body;

    const newRole = await prisma.role.update({
      where: {
        id,
      },
      data: {
        name,
        board,
        enrollment,
        exam,
        student,
        role,
        user,
        luckyDraw,
        banner,
      },
    });
    res.json({
      message: "success",
      data: [newRole],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
