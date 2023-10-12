/*
  Warnings:

  - Changed the type of `location` on the `Bathroom` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Bathroom" DROP COLUMN "location";
ALTER TABLE "Bathroom" ADD COLUMN "location" GEOMETRY(Point, 4326);


-- CreateIndex
CREATE INDEX "idx_bathroom_location_gist" ON "Bathroom" USING GIST ("location");

