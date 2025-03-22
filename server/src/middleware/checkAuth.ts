import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken) {
      const sessionHash = bearerToken.split(" ")[1];
      const session = await prisma.session.findUnique({
        where: {
          hash: sessionHash,
        },
      });

      if (session) {
        // @ts-ignore
        req.session = session;
        next();
        return;
      }
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
