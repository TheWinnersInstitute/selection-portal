import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";

export async function deleteRole(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.role.delete({
      where: { id },
    });
    res.json({
      message: "Role deleted successfully",
      data: [],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
