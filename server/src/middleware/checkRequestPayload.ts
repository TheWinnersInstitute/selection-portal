import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function checkReturnPayload(
  requestBodySchema: z.ZodObject<any>,
  check: "body" | "query" | "params" = "body"
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { success, error } = requestBodySchema.safeParse(req[check]);

      if (!success) {
        res.status(400).json({
          message: JSON.parse(error.message)[0].message,
        });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({
          message: error.message,
        });
    }
  };
}
