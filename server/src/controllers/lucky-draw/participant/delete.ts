import { Request, Response } from "express";
import { prisma } from "../../../lib";

export async function deleteLuckyDrawParticipant(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { luckyDrawId, id } = req.params;
    await prisma.luckyDrawParticipant.delete({
      where: {
        luckyDrawId,
        id,
      },
    });

    res.status(200).json({
      message: "Lucky draw participant deleted successfully",
      data: [],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
