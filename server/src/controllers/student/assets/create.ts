import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function createStudentAsset(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { userId } = req.body;

    if (req.files && Array.isArray(req.files)) {
      const assets = await Promise.all(
        req.files.map(async (file: Express.Multer.File) => {
          return prisma.asset.create({
            data: {
              // @ts-ignore
              path: file.key,
              type: file.mimetype,
              studentId: userId,
            },
          });
        })
      );
      res.status(200).json({
        message: "success",
        data: assets,
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
