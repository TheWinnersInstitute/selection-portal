import { Request, Response } from "express";
import { prisma } from "../../../lib";

export async function getLuckyDrawRewards(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { luckyDrawId } = req.params;
    const luckyDrawRewards = await prisma.luckyDrawReward.findMany({
      where: {
        luckyDrawId,
      },
    });

    res.status(200).json({
      message: "success",
      data: luckyDrawRewards,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
