import { NextFunction, Request, Response } from "express";

type Model = "exam" | "enrollment" | "board" | "student" | "user" | "role";
type Action = "read" | "create" | "update" | "delete";

export function checkAccess(mode: Model, action: Action) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // @ts-ignore
      if (req.session.role?.[mode]?.includes(action)) {
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
  };
}
