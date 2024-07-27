/*
  Warnings:

  - You are about to drop the column `goalContacts` on the `Goals` table. All the data in the column will be lost.
  - You are about to drop the column `goalContactsToReach` on the `Goals` table. All the data in the column will be lost.
  - Added the required column `goalConnections` to the `Goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalMessages` to the `Goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goals" DROP COLUMN "goalContacts",
DROP COLUMN "goalContactsToReach",
ADD COLUMN     "connections" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalConnections" INTEGER NOT NULL,
ADD COLUMN     "goalMessages" INTEGER NOT NULL,
ADD COLUMN     "messages" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
