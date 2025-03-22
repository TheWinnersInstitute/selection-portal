import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function getBoards(req: Request, res: Response) {
  try {
    const board = await prisma.board.findMany();
    res.status(200).json({
      message: "success",
      data: board,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: error.message,
      });
  }
}
