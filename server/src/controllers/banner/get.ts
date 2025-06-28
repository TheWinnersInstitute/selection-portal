import { Request, Response } from "express";
import { errorResponse, prisma } from "../../lib";
import { orderBy } from "lodash";

export async function getBanners(req: Request, res: Response): Promise<void> {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        sequence: "asc",
      },
    });
    res.status(200).json({
      message: "success",
      data: banners,
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
