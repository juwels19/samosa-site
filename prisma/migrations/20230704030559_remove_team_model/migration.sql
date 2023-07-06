/*
  Warnings:

  - You are about to drop the column `categories` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventToTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventToTeam" DROP CONSTRAINT "_EventToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToTeam" DROP CONSTRAINT "_EventToTeam_B_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "categories",
ADD COLUMN     "numberOfCategoryPicks" INTEGER NOT NULL DEFAULT 5,
ALTER COLUMN "numberOfTeamPicks" SET DEFAULT 8;

-- AlterTable
ALTER TABLE "Pick" ADD COLUMN     "displayName" TEXT;

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "_EventToTeam";
