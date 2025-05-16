import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function deleteStudentAsset(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const asset = await prisma.asset.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "success",
      data: asset,
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
