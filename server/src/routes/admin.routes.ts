import { Router } from "express";
import { checkReturnPayload } from "../middleware/checkRequestPayload";
import { z } from "zod";
import { adminLogin, getAsset, logout } from "../controllers/admin";
import { checkAuth } from "../middleware/checkAuth";
import { checkAccess } from "../middleware";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../controllers/admin/roles";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/admin/users";

// const Actions = ["read", "create", "update", "delete"]

export const adminRoutes = Router();
adminRoutes.post(
  "/login",
  checkReturnPayload(
    z.object({
      email: z.string(),
      password: z.string(),
    })
  ),
  adminLogin
);

adminRoutes.get(
  "/assets/:id",
  checkReturnPayload(
    z.object({
      id: z.string(),
    }),
    "params"
  ),
  getAsset
);

adminRoutes.get("/logout", checkAuth, logout);

adminRoutes.get("/user", checkAuth, checkAccess("user", "read"), getUsers);
adminRoutes.post(
  "/user",
  checkAuth,
  checkAccess("user", "create"),
  checkReturnPayload(
    z.object({
      email: z.string(),
      password: z.string(),
      roleId: z.string(),
    })
  ),
  createUser
);
adminRoutes.patch(
  "/user",
  checkAuth,
  checkAccess("user", "update"),
  checkReturnPayload(
    z.object({
      id: z.string(),
      roleId: z.string(),
    })
  ),
  updateUser
);
adminRoutes.delete(
  "/user/:id",
  checkAuth,
  checkAccess("user", "delete"),
  checkReturnPayload(
    z.object({
      id: z.string(),
    }),
    "params"
  ),
  deleteUser
);

adminRoutes.get("/role", checkAuth, checkAccess("role", "read"), getRoles);

adminRoutes.post(
  "/role",
  checkAuth,
  checkAccess("role", "create"),
  checkReturnPayload(
    z.object({
      name: z.string(),
      board: z.array(z.enum(["read", "create", "update", "delete"])),
      enrollment: z.array(z.enum(["read", "create", "update", "delete"])),
      exam: z.array(z.enum(["read", "create", "update", "delete"])),
      student: z.array(z.enum(["read", "create", "update", "delete"])),
      role: z.array(z.enum(["read", "create", "update", "delete"])),
      user: z.array(z.enum(["read", "create", "update", "delete"])),
    })
  ),
  createRole
);
adminRoutes.patch(
  "/role",
  checkAuth,
  checkAccess("role", "update"),
  checkReturnPayload(
    z.object({
      id: z.string(),
      name: z.string(),
      board: z.array(z.enum(["read", "create", "update", "delete"])),
      enrollment: z.array(z.enum(["read", "create", "update", "delete"])),
      exam: z.array(z.enum(["read", "create", "update", "delete"])),
      student: z.array(z.enum(["read", "create", "update", "delete"])),
      role: z.array(z.enum(["read", "create", "update", "delete"])),
      user: z.array(z.enum(["read", "create", "update", "delete"])),
    })
  ),
  updateRole
);

adminRoutes.delete(
  "/role/:id",
  checkAuth,
  checkAccess("role", "delete"),
  checkReturnPayload(
    z.object({
      id: z.string(),
    }),
    "params"
  ),
  deleteRole
);
