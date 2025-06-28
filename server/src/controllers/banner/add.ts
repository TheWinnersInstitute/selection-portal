import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";
import { getBanners } from "./get";

export async function addBanner(req: Request, res: Response): Promise<void> {
  try {
    const { name, sequence, link } = req.body;
    if (!req.file) {
      res.status(200).json({
        message: "Please attach banner",
      });
      return;
    }

    const asset = await prisma.asset.create({
      data: {
        // @ts-ignore
        path: req.file.key,
        type: req.file.mimetype,
      },
    });

    if (sequence) {
      await prisma.banner.updateMany({
        where: {
          sequence: {
            gte: parseInt(sequence, 10),
          },
        },
        data: {
          sequence: {
            increment: 1,
          },
        },
      });
    }

    await prisma.banner.create({
      data: {
        name,
        sequence: parseInt(sequence),
        link,
        imageId: asset.id,
      },
    });

    getBanners(req, res);
  } catch (error) {
    errorResponse(res, error);
  }
}
