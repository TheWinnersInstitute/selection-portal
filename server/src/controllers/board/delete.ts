import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function deleteBoard(req: Request, res: Response) {
  try {
    await prisma.board.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: "Board deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: error.message,
      });
  }
}
