import { Request, Response } from "express";
import { prisma } from "../../../lib";

export async function addLuckyDrawParticipant(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { luckyDrawId } = req.params;
    const { email, name, phone } = req.body;

    let profileId: string | undefined;
    if (req.file) {
      const asset = await prisma.asset.create({
        data: {
          // @ts-ignore
          path: req.file.key,
          type: req.file.mimetype,
        },
      });
      profileId = asset.id;
    }

    const targetLuckyDraw = await prisma.luckyDraw.findFirst({
      where: {
        id: luckyDrawId,
      },
    });

    if (!targetLuckyDraw) {
      res.status(404).json({
        message: "Lucky draw not found",
      });
      return;
    }
    const now = new Date().getTime();
    const participationEndDate = targetLuckyDraw.participationEndDate.getTime();
    if (now > participationEndDate) {
      res.status(400).json({
        message: "Sorry! participation is closed",
      });
      return;
    }

    const luckyDrawParticipantExist =
      await prisma.luckyDrawParticipant.findFirst({
        where: {
          name,
          phone,
          luckyDrawId,
        },
      });

    if (luckyDrawParticipantExist) {
      res.status(400).json({
        message: "Already participated",
      });
      return;
    }

    const luckyDrawParticipant = await prisma.luckyDrawParticipant.create({
      data: {
        email,
        name,
        phone,
        luckyDrawId,
        profileId,
      },
    });

    res.status(200).json({
      message: "Lucky draw participant add successfully",
      data: [luckyDrawParticipant],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
