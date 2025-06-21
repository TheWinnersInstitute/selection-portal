import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function getLuckyDraw(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const luckyDraw = await prisma.luckyDraw.findUnique({
      where: {
        id,
      },
    });
    if (!luckyDraw) {
      res.status(404).json({
        message: "Luck draw not found",
      });
      return;
    }

    const luckyDrawParticipantCount = await prisma.luckyDrawParticipant.count({
      where: {
        luckyDrawId: luckyDraw.id,
      },
    });

    res.status(200).json({
      message: "success",
      data: [{ ...luckyDraw, participantsCount: luckyDrawParticipantCount }],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
