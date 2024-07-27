/*
  Warnings:

  - You are about to drop the column `keys` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[auth]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[p256dh]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `auth` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `p256dh` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "keys",
ADD COLUMN     "auth" TEXT NOT NULL,
ADD COLUMN     "p256dh" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "newAction" BOOLEAN NOT NULL,
    "streak" BOOLEAN NOT NULL,
    "meetGoal" BOOLEAN NOT NULL,
    "subscriptionId" TEXT NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_subscriptionId_key" ON "NotificationSettings"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_auth_key" ON "Subscription"("auth");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_p256dh_key" ON "Subscription"("p256dh");

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
