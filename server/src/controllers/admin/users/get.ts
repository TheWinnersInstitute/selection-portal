import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          // @ts-ignore
          notIn: [req.session.userId],
        },
      },
      select: {
        id: true,
        role: true,
        email: true,
      },
    });
    res.json({
      message: "success",
      data: users,
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
