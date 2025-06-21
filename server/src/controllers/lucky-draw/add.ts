import { Request, Response } from "express";
import { prisma } from "../../lib";
import { formateDate } from ".";

export async function addLuckyDraw(req: Request, res: Response): Promise<void> {
  try {
    const { name, openingDate, participationEndDate } = req.body;

    let bannerId: string | undefined;
    if (req.file) {
      const asset = await prisma.asset.create({
        data: {
          // @ts-ignore
          path: req.file.key,
          type: req.file.mimetype,
        },
      });
      bannerId = asset.id;
    }

    const luckyDraw = await prisma.luckyDraw.create({
      data: {
        name,
        openingDate: formateDate(openingDate),
        participationEndDate: formateDate(participationEndDate),
        bannerId,
      },
    });
    res.status(200).json({
      message: "Lucky draw created successfully",
      data: [luckyDraw],
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
