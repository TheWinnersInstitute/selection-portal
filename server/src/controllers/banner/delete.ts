import { Request, Response } from "express";
import { errorResponse, prisma, S3 } from "../../lib";
import { getBanners } from "./get";

export async function deleteBanner(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const deletedBanner = await prisma.banner.delete({
      where: {
        id,
      },
    });
    await S3.instance.deleteAsset(deletedBanner.imageId);
    getBanners(req, res);
  } catch (error) {
    errorResponse(res, error);
  }
}
