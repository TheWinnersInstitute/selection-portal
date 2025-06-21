-- CreateEnum
CREATE TYPE "LuckyDrawStatus" AS ENUM ('upcoming', 'completed');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "luckyDraw" "Action"[] DEFAULT ARRAY[]::"Action"[];

-- CreateTable
CREATE TABLE "luckyDraw" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "LuckyDrawStatus" NOT NULL,
    "participationEndDate" TIMESTAMP(3) NOT NULL,
    "openingDate" TIMESTAMP(3) NOT NULL,
    "bannerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "luckyDraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luckyDrawRewards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "luckyDrawId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "luckyDrawRewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luckyDrawParticipants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "luckyDrawId" TEXT NOT NULL,
    "profileId" TEXT,
    "luckyDrawRewardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "luckyDrawParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "luckyDraw_name_key" ON "luckyDraw"("name");

-- CreateIndex
CREATE UNIQUE INDEX "luckyDrawRewards_name_luckyDrawId_key" ON "luckyDrawRewards"("name", "luckyDrawId");

-- CreateIndex
CREATE UNIQUE INDEX "luckyDrawParticipants_luckyDrawId_name_phone_key" ON "luckyDrawParticipants"("luckyDrawId", "name", "phone");

-- AddForeignKey
ALTER TABLE "luckyDraw" ADD CONSTRAINT "luckyDraw_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luckyDrawRewards" ADD CONSTRAINT "luckyDrawRewards_luckyDrawId_fkey" FOREIGN KEY ("luckyDrawId") REFERENCES "luckyDraw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luckyDrawRewards" ADD CONSTRAINT "luckyDrawRewards_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luckyDrawParticipants" ADD CONSTRAINT "luckyDrawParticipants_luckyDrawRewardId_fkey" FOREIGN KEY ("luckyDrawRewardId") REFERENCES "luckyDrawRewards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luckyDrawParticipants" ADD CONSTRAINT "luckyDrawParticipants_luckyDrawId_fkey" FOREIGN KEY ("luckyDrawId") REFERENCES "luckyDraw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luckyDrawParticipants" ADD CONSTRAINT "luckyDrawParticipants_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
