-- DropForeignKey
ALTER TABLE "luckyDraw" DROP CONSTRAINT "luckyDraw_bannerId_fkey";

-- DropForeignKey
ALTER TABLE "luckyDrawRewards" DROP CONSTRAINT "luckyDrawRewards_assetId_fkey";

-- AlterTable
ALTER TABLE "luckyDraw" ALTER COLUMN "status" SET DEFAULT 'upcoming',
ALTER COLUMN "bannerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "luckyDrawRewards" ALTER COLUMN "assetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "luckyDraw" ADD CONSTRAINT "luckyDraw_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luckyDrawRewards" ADD CONSTRAINT "luckyDrawRewards_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
