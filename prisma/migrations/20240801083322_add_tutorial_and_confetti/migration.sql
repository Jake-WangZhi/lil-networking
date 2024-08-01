-- AlterTable
ALTER TABLE "Goals" ADD COLUMN     "hasShownConfetti" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasViewedContactsTutorial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasViewedDashboardTutorial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasViewedProfileTutorial" BOOLEAN NOT NULL DEFAULT false;
