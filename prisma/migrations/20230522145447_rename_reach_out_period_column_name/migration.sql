/*
  Warnings:

  - You are about to drop the column `reachOutPeriod` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "reachOutPeriod",
ADD COLUMN     "goalDays" INTEGER;
