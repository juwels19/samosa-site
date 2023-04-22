/*
  Warnings:

  - You are about to drop the column `answers` on the `Pick` table. All the data in the column will be lost.
  - You are about to drop the column `eventCode` on the `Pick` table. All the data in the column will be lost.
  - Added the required column `answersJSON` to the `Pick` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `Pick` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pick" DROP COLUMN "answers",
DROP COLUMN "eventCode",
ADD COLUMN     "answersJSON" TEXT NOT NULL,
ADD COLUMN     "eventId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "eventCode" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "isSubmissionClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pick" ADD CONSTRAINT "Pick_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
