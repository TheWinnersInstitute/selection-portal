import { Request, Response } from "express";
import { prisma } from "../../lib";

export async function confirmLuckyDrawWinners(req: Request, res: Response) {
  try {
    const winners: {
      id: string;
      name: string;
      email: string;
      phone: string;
      profileId?: string;
    }[] = req.body.winners;
    const { luckyDrawId, luckyDrawRewardId } = req.params;

    const data = await prisma.$transaction(
      winners.map((winner) => {
        return prisma.luckyDrawParticipant.update({
          where: {
            id: winner.id,
            name: winner.name,
            email: winner.email,
            phone: winner.phone,
            luckyDrawId,
          },
          data: {
            isWinner: true,
            luckyDrawRewardId,
          },
        });
      })
    );
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {}
}
