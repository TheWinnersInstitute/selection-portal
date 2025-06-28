import { Request, Response } from "express";
import { errorResponse, prisma, S3 } from "../../lib";
import { getBanners } from "./get";

export async function updateBanner(req: Request, res: Response): Promise<void> {
  try {
    const { name, sequence, id, link } = req.body;

    let imageId;
    if (req.file) {
      const targetBanner = await prisma.banner.findFirst({
        where: {
          id,
        },
      });

      if (!targetBanner) {
        res.status(404).json({
          message: "Banner not found",
        });
        return;
      }
      await S3.instance.deleteAsset(targetBanner.imageId);
      const asset = await prisma.asset.create({
        data: {
          // @ts-ignore
          path: req.file.key,
          type: req.file.mimetype,
        },
      });
      imageId = asset.id;
    }

    await prisma.banner.update({
      where: {
        id,
      },
      data: {
        name,
        sequence: parseInt(sequence, 10),
        imageId,
        link,
      },
    });

    getBanners(req, res);
  } catch (error) {
    errorResponse(res, error);
  }
}
