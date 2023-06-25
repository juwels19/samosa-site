-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];
