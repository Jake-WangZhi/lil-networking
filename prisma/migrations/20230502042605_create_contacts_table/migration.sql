-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "image" TEXT,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_email_key" ON "Contacts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_phone_key" ON "Contacts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_website_key" ON "Contacts"("website");
