/*
  Warnings:

  - The values [TRANSFER,INTERVIEW,MATCH,PRESS_RELEASE] on the enum `ColumnCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ColumnCategory_new" AS ENUM ('transfer', 'interview', 'match', 'pressRelease');
ALTER TABLE "Column" ALTER COLUMN "category" TYPE "ColumnCategory_new" USING ("category"::text::"ColumnCategory_new");
ALTER TYPE "ColumnCategory" RENAME TO "ColumnCategory_old";
ALTER TYPE "ColumnCategory_new" RENAME TO "ColumnCategory";
DROP TYPE "ColumnCategory_old";
COMMIT;
