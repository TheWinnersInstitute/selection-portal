import { Request, Response } from "express";
import { prisma } from "../../../lib";

export async function updateLuckyDrawParticipant(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { luckyDrawId } = req.params;
    const { id, email, name, phone } = req.body;

    const luckyDrawParticipant = await prisma.luckyDrawParticipant.update({
      where: { id, luckyDrawId },
      data: {
        email,
        name,
        phone,
      },
    });

    res.status(200).json({
      message: "Lucky draw participant updated successfully",
      data: [luckyDrawParticipant],
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: "Internal server error",
        details: error.message,
      });
  }
}
