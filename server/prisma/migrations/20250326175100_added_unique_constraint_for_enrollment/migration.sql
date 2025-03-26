/*
  Warnings:

  - A unique constraint covering the columns `[rollNumber,examId]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "enrollments_rollNumber_examId_key" ON "enrollments"("rollNumber", "examId");
