import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function updateUser(req: Request, res: Response) {
  try {
    const { id, roleId } = req.body;

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        roleId,
      },
      select: {
        id: true,
        role: true,
        email: true,
      },
    });
    res.json({
      message: "success",
      data: [user],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
