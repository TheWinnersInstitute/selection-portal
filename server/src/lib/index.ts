import { Response } from "express";

export * from "./seed";
export * from "./db";
export * from "./redis";
export * from "./google";
export * from "./s3";

export const errorResponse = (
  res: Response,
  error: any,
  status: number = 500
) => {
  console.log(error);
  if (error instanceof Error)
    res.status(status).json({
      message: "Internal server error",
      details: error.message,
    });
};
