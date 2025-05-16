import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function createUserAsset(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { userId } = req.body;

    if (req.file) {
      const asset = await prisma.asset.create({
        data: {
          // @ts-ignore
          path: req.file.key,
          type: req.file.mimetype,
          userId,
        },
      });

      res.status(200).json({
        message: "success",
        data: asset,
      });
      return;
    }

    res.status(400).json({
      message: "No file uploaded",
      data: null,
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
