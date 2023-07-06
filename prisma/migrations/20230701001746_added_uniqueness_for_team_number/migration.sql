/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_number_key" ON "Team"("number");
