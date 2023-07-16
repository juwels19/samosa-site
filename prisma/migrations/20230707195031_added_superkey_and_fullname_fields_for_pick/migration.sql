/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `Pick` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userFullname` to the `Pick` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pick" ADD COLUMN     "userFullname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pick_userId_eventId_key" ON "Pick"("userId", "eventId");
