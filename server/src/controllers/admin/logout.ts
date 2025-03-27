import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";

export async function logout(req: Request, res: Response) {
  try {
    await prisma.session.delete({
      where: {
        // @ts-ignore
        id: req.session.id,
      },
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
