import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { errorResponse, prisma } from "../../../lib";

export async function deleteEnrollment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.enrollment.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "success",
      data: [],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
