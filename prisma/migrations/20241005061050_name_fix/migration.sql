/*
  Warnings:

  - You are about to drop the column `games_played` on the `TeamMemberStatistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TeamMemberStatistics" DROP COLUMN "games_played",
ADD COLUMN     "gamesPlayed" INTEGER NOT NULL DEFAULT 0;
