import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.session.deleteMany({
      where: {
        userId: id,
      },
    });

    await prisma.user.delete({
      where: { id },
    });
    res.json({
      message: "User deleted successfully",
      data: [],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
