import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function deleteLuckyDraw(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.luckyDrawParticipant.deleteMany({
      where: {
        luckyDrawId: id,
      },
    });
    await prisma.luckyDrawReward.deleteMany({
      where: {
        luckyDrawId: id,
      },
    });
    await prisma.luckyDraw.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Lucky draw deleted successfully",
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
