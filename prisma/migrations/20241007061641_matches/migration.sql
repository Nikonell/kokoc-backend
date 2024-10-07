-- CreateEnum
CREATE TYPE "MatchResult" AS ENUM ('win', 'loss', 'draw');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_columnId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "matchId" INTEGER,
ALTER COLUMN "columnId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "matchName" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "secondTeamName" TEXT NOT NULL,
    "kokocGoalsScored" INTEGER NOT NULL,
    "kokocGoalsConceded" INTEGER NOT NULL,
    "secondTeamGoalsScored" INTEGER NOT NULL,
    "secondTeamGoalsConceded" INTEGER NOT NULL,
    "kokocYellowCards" INTEGER NOT NULL,
    "kokocRedCards" INTEGER NOT NULL,
    "secondTeamYellowCards" INTEGER NOT NULL,
    "secondTeamRedCards" INTEGER NOT NULL,
    "result" "MatchResult" NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecondTeamComposition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "SecondTeamComposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_KokocMatchComposition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_KokocMatchComposition_AB_unique" ON "_KokocMatchComposition"("A", "B");

-- CreateIndex
CREATE INDEX "_KokocMatchComposition_B_index" ON "_KokocMatchComposition"("B");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondTeamComposition" ADD CONSTRAINT "SecondTeamComposition_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KokocMatchComposition" ADD CONSTRAINT "_KokocMatchComposition_A_fkey" FOREIGN KEY ("A") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KokocMatchComposition" ADD CONSTRAINT "_KokocMatchComposition_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
