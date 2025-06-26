import { Request, Response } from "express";
import { prisma } from "../../lib";
import { LuckyDrawParticipant } from "@prisma/client";

export async function startLuckyDraw(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { count } = req.query;
    const { luckyDrawId, luckyDrawRewardId } = req.params;
    const targetLuckyDrawReward = await prisma.luckyDrawReward.findFirst({
      where: {
        id: luckyDrawRewardId as string,
      },
    });

    if (!targetLuckyDrawReward) {
      res.status(404).json({
        message: "Lucky draw not found",
      });
      return;
    }

    const numberOfRewardsAlreadyDrawn = await prisma.luckyDrawParticipant.count(
      {
        where: {
          isWinner: true,
          luckyDrawRewardId: targetLuckyDrawReward.id,
          luckyDrawId,
        },
      }
    );
    const numberOfParticipantsToDraw =
      parseInt(count as string, 10) || targetLuckyDrawReward.count;

    if (
      numberOfParticipantsToDraw >
        targetLuckyDrawReward.count - numberOfRewardsAlreadyDrawn ||
      targetLuckyDrawReward.count === 0
    ) {
      res.status(404).json({
        message: `Sorry only ${
          targetLuckyDrawReward.count - numberOfRewardsAlreadyDrawn
        } "${targetLuckyDrawReward.name}" left`,
      });
      return;
    }

    const participantsCount = await prisma.luckyDrawParticipant.count({
      where: {
        luckyDrawId,
        isWinner: false,
      },
    });

    console.log({ participantsCount });
    const randomIndexes = new Set<number>();
    while (randomIndexes.size < numberOfParticipantsToDraw) {
      randomIndexes.add(Math.floor(Math.random() * participantsCount));
    }

    const winners = await Promise.all(
      [...randomIndexes].map((offset) =>
        prisma.luckyDrawParticipant.findFirst({
          skip: offset,
        })
      )
    );

    res.status(200).json({
      message: "success",
      data: winners
        .filter((w) => !!w)
        .map((winner) => {
          return {
            id: winner.id,
            name: winner.name,
            email: winner.email,
            phone: winner.phone,
            profileId: winner.profileId,
          };
        }),
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}

function findRandomBetween(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}
