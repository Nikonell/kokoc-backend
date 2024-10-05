-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('goalkeeper', 'defender', 'midfielder', 'forward', 'coach');

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "role" "TeamRole" NOT NULL,
    "avatar" TEXT NOT NULL,
    "info" TEXT NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMemberStatistics" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "games_played" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "yellowCards" INTEGER NOT NULL DEFAULT 0,
    "redCards" INTEGER NOT NULL DEFAULT 0,
    "teamMemberId" INTEGER NOT NULL,

    CONSTRAINT "TeamMemberStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMemberAttachment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT NOT NULL,
    "teamMemberId" INTEGER NOT NULL,

    CONSTRAINT "TeamMemberAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMemberStatistics_teamMemberId_key" ON "TeamMemberStatistics"("teamMemberId");

-- AddForeignKey
ALTER TABLE "TeamMemberStatistics" ADD CONSTRAINT "TeamMemberStatistics_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMemberAttachment" ADD CONSTRAINT "TeamMemberAttachment_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
