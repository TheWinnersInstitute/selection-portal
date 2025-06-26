import { Request, Response } from "express";
import { prisma } from "../../../lib";
import xlsx from "xlsx";
import { LuckyDrawParticipant } from "@prisma/client";

type BoolMapType = { [key: string]: boolean };

export async function addLuckyDrawParticipants(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.file) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    const { luckyDrawId } = req.params;

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

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      res.status(400).json({
        message: "No data in the file",
      });
      return;
    }

    const existingParticipants = await prisma.luckyDrawParticipant.findMany({
      where: {
        luckyDrawId,
      },
    });

    const BATCH_SIZE = 1000;
    const batches = Math.ceil(sheetData.length / BATCH_SIZE);
    const duplicateMap: BoolMapType = existingParticipants.reduce(
      (prev, curr) => {
        return { ...prev, [`${curr.name.toLowerCase()}-${curr.phone}`]: true };
      },
      {} as BoolMapType
    );

    const data = sheetData
      .filter((item: any) => {
        let duplicate =
          !!duplicateMap[`${item.Name.toLowerCase()}-${item.Phone}`];
        duplicateMap[`${item.Name.toLowerCase()}-${item.Phone}`] = true;
        return !duplicate;
      })
      .map((item: any) => {
        return {
          luckyDrawId,
          name: item.Name,
          phone: `${item.Phone}`,
          email: item.Email,
        };
      });

    const participants = await prisma.$transaction(
      data.map((item) => {
        return prisma.luckyDrawParticipant.create({
          data: item,
        });
      })
    );

    res.status(200).json({
      message: "Lucky draw participant add successfully",
      data: participants.slice(0, 100),
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
