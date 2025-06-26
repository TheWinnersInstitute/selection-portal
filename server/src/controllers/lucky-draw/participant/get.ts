import { Request, Response } from "express";
import { prisma } from "../../../lib";

export async function getLuckyDrawParticipants(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { luckyDrawId } = req.params;
    const { winners, cursor } = req.query;
    const luckyDrawParticipants = await prisma.luckyDrawParticipant.findMany({
      where: {
        luckyDrawId,
        isWinner: !!winners ? winners === "true" : undefined,
      },
      cursor: cursor ? { id: cursor as string } : undefined,
      take: 101,
    });

    const total = await prisma.luckyDrawParticipant.count({
      where: {
        luckyDrawId,
        isWinner: !!winners ? winners === "true" : undefined,
      },
    });

    const newCursor = luckyDrawParticipants.pop();

    res.status(200).json({
      message: "success",
      data: luckyDrawParticipants,
      total,
      cursor: newCursor?.id,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
