import { Response } from "express";

export * from "./seed";
export * from "./db";
export * from "./redis";
export * from "./google";
export * from "./s3";

export const errorResponse = (res: Response, error: any) => {
  console.log(error);
  if (error instanceof Error)
    res.status(500).json({
      message: "Internal server error",
      details: error.message,
    });
};
