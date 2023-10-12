/*
  Warnings:

  - You are about to alter the column `location` on the `Bathroom` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `ByteA`.

*/
-- DropIndex
DROP INDEX "idx_bathroom_location_gist";

-- AlterTable
ALTER TABLE "Bathroom" ALTER COLUMN "location" SET DATA TYPE BYTEA;

-- CreateIndex
CREATE INDEX "idx_bathroom_location" ON "Bathroom"("location");
