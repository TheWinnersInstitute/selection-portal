import { Request, Response } from "express";
import { errorResponse, prisma } from "../../../lib";
import crypto from "crypto";

export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, roleId } = req.body;

    const hashedPassword = crypto
      .createHash("sha256")
      .update(`${process.env.SECRET}-${password}`)
      .digest("hex")
      .toString();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId,
      },
      select: {
        id: true,
        role: true,
        email: true,
      },
    });
    res.json({
      message: "success",
      data: [user],
    });
  } catch (error) {
    errorResponse(res, error);
  }
}
