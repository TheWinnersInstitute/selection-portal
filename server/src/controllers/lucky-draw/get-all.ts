import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function getAllLuckyDraws(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const luckyDraws = await prisma.luckyDraw.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(200).json({
      message: "success",
      data: luckyDraws,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
