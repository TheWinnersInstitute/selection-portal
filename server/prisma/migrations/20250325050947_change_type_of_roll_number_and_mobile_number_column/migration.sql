/*
  Warnings:

  - Changed the type of `rollNumber` on the `enrollments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `contactNumber` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "rollNumber",
ADD COLUMN     "rollNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "contactNumber",
ADD COLUMN     "contactNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_name_contactNumber_key" ON "students"("name", "contactNumber");
