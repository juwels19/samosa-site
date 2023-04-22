-- CreateTable
CREATE TABLE "Pick" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventCode" TEXT NOT NULL,

    CONSTRAINT "Pick_pkey" PRIMARY KEY ("id")
);
