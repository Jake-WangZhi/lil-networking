/*
  Warnings:

  - You are about to drop the column `LinkedInId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Users_LinkedInId_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "LinkedInId",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "picture" TEXT,
ADD COLUMN     "providerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_providerId_key" ON "Users"("providerId");
