/*
  Warnings:

  - You are about to drop the column `avatar` on the `TeamMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "avatar";

-- CreateTable
CREATE TABLE "TeamStatistics" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gamesPlayed" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "winsOvertime" INTEGER NOT NULL,
    "winsPenalty" INTEGER NOT NULL,
    "lossesPenalty" INTEGER NOT NULL,
    "lossesOvertime" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "goalsScored" INTEGER NOT NULL,
    "goalsConceded" INTEGER NOT NULL,
    "yellowCards" INTEGER NOT NULL,
    "redCards" INTEGER NOT NULL,
    "cleanSheets" INTEGER NOT NULL,

    CONSTRAINT "TeamStatistics_pkey" PRIMARY KEY ("id")
);
