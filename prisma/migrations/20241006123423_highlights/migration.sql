-- CreateTable
CREATE TABLE "TeamMemberHighlight" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "teamMemberId" INTEGER NOT NULL,

    CONSTRAINT "TeamMemberHighlight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamMemberHighlight" ADD CONSTRAINT "TeamMemberHighlight_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
