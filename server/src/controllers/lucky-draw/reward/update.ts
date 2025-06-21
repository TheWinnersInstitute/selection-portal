import { Request, Response } from "express";
import { prisma } from "../../../lib";

export async function updateLuckyDrawReward(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { luckyDrawId } = req.params;
    const { count, name, id } = req.body;

    let assetId: string | undefined;
    if (req.file) {
      const asset = await prisma.asset.create({
        data: {
          // @ts-ignore
          path: req.file.key,
          type: req.file.mimetype,
        },
      });
      assetId = asset.id;
    }

    const luckyDrawReward = await prisma.luckyDrawReward.update({
      where: { id, luckyDrawId },
      data: {
        name,
        count: parseInt(count, 10),
        ...(assetId ? { assetId } : {}),
      },
    });

    res.status(200).json({
      message: "Lucky draw reward updated successfully",
      data: [luckyDrawReward],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
