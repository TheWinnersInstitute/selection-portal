import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib";

export async function checkAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore
    if (req.session.role === "admin") {
      next();
      return;
    }

    res.status(401).json({
      message: "Unauthorized",
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({
        message: error.message,
      });
  }
}
