import { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getBoards,
  updateBoard,
} from "../controllers/board";
import { checkReturnPayload, checkAccess, checkAuth } from "../middleware";
import { z } from "zod";

export const boardRoutes = Router();

boardRoutes.get("/", getBoards);
boardRoutes.post(
  "/",
  checkAuth,
  checkAccess("board", "create"),
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
  checkAccess("board", "delete"),
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
  checkAccess("board", "update"),
  checkReturnPayload(
    z.object({
      id: z.string().max(100),
      name: z.string().max(100).min(1),
      description: z.string().max(1000).min(5),
    })
  ),
  updateBoard
);
