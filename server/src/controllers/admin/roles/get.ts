import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function getRoles(req: Request, res: Response) {
  try {
    const roles = await prisma.role.findMany();
    res.json({
      message: "success",
      data: roles,
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
