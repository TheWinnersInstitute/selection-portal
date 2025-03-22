import { Request, Response } from "express";

import z from "zod";
import { prisma } from "../../lib";

export async function createBoard(req: Request, res: Response) {
  try {
    const { description, name } = req.body;

    const board = await prisma.board.create({
      data: {
        description,
        name,
        // @ts-ignore
        userId: req.session.userId,
      },
    });

    res.status(200).json({
      message: "success",
      data: [board],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: error.message,
      });
  }
}
