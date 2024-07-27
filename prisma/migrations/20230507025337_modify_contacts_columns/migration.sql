/*
  Warnings:

  - You are about to drop the column `image` on the `Contacts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Contacts_email_key";

-- DropIndex
DROP INDEX "Contacts_phone_key";

-- DropIndex
DROP INDEX "Contacts_website_key";

-- AlterTable
ALTER TABLE "Contacts" DROP COLUMN "image",
ADD COLUMN     "picture" TEXT;
