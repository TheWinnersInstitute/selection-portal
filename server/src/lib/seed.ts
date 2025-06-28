import { prisma } from "./db";
import crypto from "crypto";

export async function seed() {
  const adminEmail = "admin@gmail.com";

  let role = await prisma.role.findUnique({
    where: {
      name: "Admin",
    },
  });

  const adminExist = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!role) {
    role = await prisma.role.create({
      data: {
        name: "Admin",
        board: ["create", "delete", "read", "update"],
        enrollment: ["create", "delete", "read", "update"],
        exam: ["create", "delete", "read", "update"],
        role: ["create", "delete", "read", "update"],
        user: ["create", "delete", "read", "update"],
        student: ["create", "delete", "read", "update"],
        banner: ["create", "delete", "read", "update"],
        luckyDraw: ["create", "delete", "read", "update"],
      },
    });
    if (adminExist) {
      await prisma.user.update({
        where: { id: adminExist.id },
        data: {
          roleId: role.id,
        },
      });
    }
    console.log("Admin role created");
  }

  const passwordHash = crypto
    .createHash("sha256")
    .update(`${process.env.SECRET}-${process.env.ADMIN_PASSWORD}`)
    .digest("hex")
    .toString();
  if (!adminExist) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: passwordHash,
        roleId: role.id,
      },
    });
    console.log("Admin user created successfully");
  } else {
    console.log("Admin user already exist");
  }
}
