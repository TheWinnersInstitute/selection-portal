-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "studentId" TEXT;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
