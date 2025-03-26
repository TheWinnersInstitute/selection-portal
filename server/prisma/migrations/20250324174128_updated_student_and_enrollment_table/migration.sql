/*
  Warnings:

  - You are about to drop the column `rollNo` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `postAllotment` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,contactNumber]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rollNumber` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Made the column `contactNumber` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "rollNo",
ADD COLUMN     "post" TEXT,
ADD COLUMN     "rollNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "postAllotment",
ALTER COLUMN "contactNumber" SET NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_name_contactNumber_key" ON "students"("name", "contactNumber");
