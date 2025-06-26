import { Router } from "express";
import { checkAccess, checkAuth, checkRequestPayload } from "../middleware";
import {
  addLuckyDraw,
  deleteLuckyDraw,
  getAllLuckyDraws,
  getLuckyDraw,
  updateLuckyDraw,
  confirmLuckyDrawWinners,
  startLuckyDraw,
} from "../controllers/lucky-draw";
import { z } from "zod";
import {
  addLuckyDrawParticipant,
  addLuckyDrawParticipants,
  deleteLuckyDrawParticipant,
  downloadLuckyDrawWinnersExcel,
  getLuckyDrawParticipants,
  updateLuckyDrawParticipant,
} from "../controllers/lucky-draw/participant";
import { S3, studentBulkUpload } from "../lib";
import {
  addLuckyDrawReward,
  deleteLuckyDrawReward,
  getLuckyDrawRewards,
  updateLuckyDrawReward,
} from "../controllers/lucky-draw/reward";

export const luckyDrawRoutes = Router();

luckyDrawRoutes.get(
  "/",
  checkAuth,
  checkAccess("luckyDraw", "read"),
  getAllLuckyDraws
);
luckyDrawRoutes.get(
  "/:id",
  checkRequestPayload(
    z.object({
      id: z.string(),
    }),
    "params"
  ),
  getLuckyDraw
);

luckyDrawRoutes.post(
  "/",
  checkAuth,
  checkAccess("luckyDraw", "create"),
  S3.instance.uploadResult.single("file"),
  checkRequestPayload(
    z.object({
      name: z.string(),
      openingDate: z.string(),
      participationEndDate: z.string(),
    }),
    "body"
  ),
  addLuckyDraw
);

luckyDrawRoutes.patch(
  "/",
  checkAuth,
  checkAccess("luckyDraw", "update"),
  S3.instance.uploadResult.single("file"),
  checkRequestPayload(
    z.object({
      id: z.string(),
      name: z.string(),
      openingDate: z.string(),
      participationEndDate: z.string(),
    }),
    "body"
  ),
  updateLuckyDraw
);

luckyDrawRoutes.delete(
  "/:id",
  checkAuth,
  checkAccess("luckyDraw", "delete"),
  checkRequestPayload(
    z.object({
      id: z.string().uuid(),
    }),
    "params"
  ),
  deleteLuckyDraw
);

luckyDrawRoutes.get(
  "/participant/:luckyDrawId",
  checkAuth,
  checkAccess("luckyDraw", "read"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
    }),
    "params"
  ),
  checkRequestPayload(
    z.object({
      winners: z.string().optional(),
      cursor: z.string().uuid().optional(),
    }),
    "query"
  ),
  getLuckyDrawParticipants
);

luckyDrawRoutes.delete(
  "/participant/:luckyDrawId/:id",
  checkAuth,
  checkAccess("luckyDraw", "delete"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
      id: z.string().uuid(),
    }),
    "params"
  ),
  deleteLuckyDrawParticipant
);

luckyDrawRoutes.post(
  "/participant/:luckyDrawId",
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
    }),
    "params"
  ),
  S3.instance.uploadResult.single("file"),
  checkRequestPayload(
    z.object({
      email: z.string().email(),
      name: z.string().max(100),
      phone: z.string().length(10),
    }),
    "body"
  ),
  addLuckyDrawParticipant
);

luckyDrawRoutes.post(
  "/participants/:luckyDrawId",
  checkAuth,
  checkAccess("luckyDraw", "create"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
    }),
    "params"
  ),
  studentBulkUpload.single("file"),
  addLuckyDrawParticipants
);

luckyDrawRoutes.get(
  "/participants/:luckyDrawId/download",
  checkAuth,
  checkAccess("luckyDraw", "read"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
    }),
    "params"
  ),
  downloadLuckyDrawWinnersExcel
);

luckyDrawRoutes.patch(
  "/participant/:luckyDrawId",
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
    }),
    "params"
  ),
  S3.instance.uploadResult.single("file"),
  checkRequestPayload(
    z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      name: z.string().max(100),
      phone: z.string().length(10),
    }),
    "body"
  ),
  updateLuckyDrawParticipant
);

luckyDrawRoutes.get(
  "/reward/:luckyDrawId",
  // checkAuth,
  // checkAccess("luckyDraw", "read"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
    }),
    "params"
  ),
  getLuckyDrawRewards
);

luckyDrawRoutes.delete(
  "/reward/:luckyDrawId/:id",
  checkAuth,
  checkAccess("luckyDraw", "read"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
      id: z.string().uuid(),
    }),
    "params"
  ),
  deleteLuckyDrawReward
);

luckyDrawRoutes.post(
  "/reward/:luckyDrawId",
  checkAuth,
  checkAccess("luckyDraw", "create"),
  S3.instance.uploadResult.single("file"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
    }),
    "params"
  ),
  checkRequestPayload(
    z.object({
      count: z.string().max(10000),
      name: z.string().max(100),
    }),
    "body"
  ),
  addLuckyDrawReward
);

luckyDrawRoutes.patch(
  "/reward/:luckyDrawId",
  checkAuth,
  checkAccess("luckyDraw", "update"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
    }),
    "params"
  ),
  S3.instance.uploadResult.single("file"),
  checkRequestPayload(
    z.object({
      id: z.string().uuid(),
      count: z.string().max(10000),
      name: z.string().max(100),
    }),
    "body"
  ),
  updateLuckyDrawReward
);

luckyDrawRoutes.get(
  "/:luckyDrawId/:luckyDrawRewardId",
  checkAuth,
  checkAccess("luckyDraw", "update"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
      luckyDrawRewardId: z.string().uuid(),
    }),
    "params"
  ),
  checkRequestPayload(
    z.object({
      count: z.string().optional(),
    }),
    "query"
  ),
  startLuckyDraw
);

luckyDrawRoutes.post(
  "/:luckyDrawId/:luckyDrawRewardId",
  checkAuth,
  checkAccess("luckyDraw", "update"),
  checkRequestPayload(
    z.object({
      luckyDrawId: z.string().uuid(),
      luckyDrawRewardId: z.string().uuid(),
    }),
    "params"
  ),
  checkRequestPayload(
    z.object({
      winners: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          phone: z.string(),
          profileId: z.string().nullable().optional(),
        })
      ),
    }),
    "body"
  ),
  confirmLuckyDrawWinners
);
