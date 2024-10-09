-- AlterTable
ALTER TABLE "User" ADD COLUMN     "viewedMatches" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
