/*
  Warnings:

  - You are about to drop the column `role` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('read', 'create', 'update', 'delete');

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "role",
ADD COLUMN     "roleId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "roleId" TEXT;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exam" "Action"[],
    "enrollment" "Action"[],
    "board" "Action"[],
    "student" "Action"[],
    "user" "Action"[],
    "role" "Action"[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
