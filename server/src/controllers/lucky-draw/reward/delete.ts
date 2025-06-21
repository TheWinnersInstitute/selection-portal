import { Request, Response } from "express";
import { prisma } from "../../../lib";

export async function deleteLuckyDrawReward(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { luckyDrawId, id } = req.params;
    await prisma.luckyDrawReward.delete({
      where: {
        luckyDrawId,
        id,
      },
    });

    res.status(200).json({
      message: "Lucky draw reward deleted successfully",
      data: [],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
