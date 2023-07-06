/*
  Warnings:

  - The values [MALE,FEMALE] on the enum `BathroomGender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BathroomGender_new" AS ENUM ('GENDERED', 'GENDER_NEUTRAL', 'BOTH');
ALTER TABLE "Bathroom" ALTER COLUMN "gender" TYPE "BathroomGender_new" USING ("gender"::text::"BathroomGender_new");
ALTER TYPE "BathroomGender" RENAME TO "BathroomGender_old";
ALTER TYPE "BathroomGender_new" RENAME TO "BathroomGender";
DROP TYPE "BathroomGender_old";
COMMIT;
