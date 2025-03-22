import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../../lib";

export async function adminLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid email" });
      return;
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(`${process.env.SECRET}-${password}`)
      .digest("hex")
      .toString();
    if (hashedPassword !== user.password) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const sessionHash = crypto
      .createHash("sha256")
      .update(`${user.id}-${password}-${new Date().toString()}`)
      .digest("hex")
      .toString();

    await prisma.session.create({
      data: {
        hash: sessionHash,
        role: user.role,
        userId: user.id,
      },
    });
    res.status(200).json({
      message: "Login successful",
      data: [sessionHash],
    });
    return;
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: error.message,
      });
  }
}
