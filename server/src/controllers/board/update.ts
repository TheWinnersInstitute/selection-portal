import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function updateBoard(req: Request, res: Response) {
  try {
    const updatedBoard = await prisma.board.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });
    res.status(200).json({
      message: "Board updated successfully",
      data: [updatedBoard],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: error.message,
      });
  }
}
