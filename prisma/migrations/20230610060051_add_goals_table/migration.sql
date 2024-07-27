-- CreateTable
CREATE TABLE "Goals" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "networkingComfortLevel" INTEGER NOT NULL,
    "goalContacts" INTEGER NOT NULL,
    "goalContactsToReach" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Goals_userId_key" ON "Goals"("userId");

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
