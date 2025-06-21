import { Request, Response } from "express";
import { prisma } from "../../lib";
import { LuckyDraw } from "@prisma/client";
import { formateDate } from ".";

export async function updateLuckyDraw(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id, name, openingDate, participationEndDate } = req.body;

    const data: {
      name: string;
      openingDate: Date;
      participationEndDate: Date;
      bannerId?: string;
    } = {
      name,
      openingDate: formateDate(openingDate),
      participationEndDate: formateDate(participationEndDate),
      bannerId: "",
    };

    if (req.file) {
      const asset = await prisma.asset.create({
        data: {
          // @ts-ignore
          path: req.file.key,
          type: req.file.mimetype,
        },
      });
      data.bannerId = asset.id;
    }

    if (data.bannerId === "") {
      delete data["bannerId"];
    }

    const luckyDraw = await prisma.luckyDraw.update({
      where: {
        id,
      },
      data,
    });
    res.status(200).json({
      message: "Lucky draw updated successfully",
      data: [luckyDraw],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
