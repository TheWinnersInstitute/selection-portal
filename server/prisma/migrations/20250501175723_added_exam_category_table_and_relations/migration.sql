-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "examCategoryId" TEXT,
ADD COLUMN     "year" INTEGER;

-- CreateTable
CREATE TABLE "exam_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "exam_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam_categories" ADD CONSTRAINT "exam_categories_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_examCategoryId_fkey" FOREIGN KEY ("examCategoryId") REFERENCES "exam_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
