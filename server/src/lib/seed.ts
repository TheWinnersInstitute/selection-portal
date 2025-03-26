import { prisma } from "./db";
import crypto from "crypto";

export async function seed() {
  const adminEmail = "admin@gmail.com";
  const adminExist = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

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
        role: "admin",
      },
    });
    console.log("Admin user created successfully");
  } else {
    console.log("Admin user already exist");
  }
}
