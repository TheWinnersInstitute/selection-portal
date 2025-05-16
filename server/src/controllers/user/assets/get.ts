import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function getUserAssets(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const assets = await prisma.asset.findMany({
      where: {
        userId: id,
      },
    });

    res.status(200).json({
      message: "success",
      data: assets,
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
