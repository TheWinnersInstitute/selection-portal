import { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getBoards,
  updateBoard,
} from "../controllers/board";
import { checkAuth } from "../middleware/checkAuth";
import { checkAdmin } from "../middleware/checkAdmin";
import { checkReturnPayload } from "../middleware/checkRequestPayload";
import { z } from "zod";

export const boardRoutes = Router();

boardRoutes.get("/", getBoards);
boardRoutes.post(
  "/",
  checkAuth,
  checkAdmin,
  checkReturnPayload(
    z.object({
      name: z.string().max(100).min(1),
      description: z.string().max(1000).min(5),
    })
  ),
  createBoard
);
boardRoutes.delete(
  "/:id",
  checkAuth,
  checkAdmin,
  checkReturnPayload(
    z.object({
      id: z.string().max(100),
    }),
    "params"
  ),
  deleteBoard
);

boardRoutes.patch(
  "/",
  checkAuth,
  checkAdmin,
  checkReturnPayload(
    z.object({
      id: z.string().max(100),
      name: z.string().max(100).min(1),
      description: z.string().max(1000).min(5),
    })
  ),
  updateBoard
);
