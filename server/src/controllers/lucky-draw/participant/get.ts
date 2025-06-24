import { Request, Response } from "express";
import { prisma } from "../../../lib";

export async function getLuckyDrawParticipants(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { luckyDrawId } = req.params;
    const { winners } = req.query;
    const luckyDrawParticipants = await prisma.luckyDrawParticipant.findMany({
      where: {
        luckyDrawId,
        isWinner: !!winners ? winners === "true" : undefined,
      },
    });

    res.status(200).json({
      message: "success",
      data: luckyDrawParticipants,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
