/*
  Warnings:

  - You are about to drop the column `verifiedById` on the `Bathroom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bathroom" DROP CONSTRAINT "Bathroom_verifiedById_fkey";

-- AlterTable
ALTER TABLE "Bathroom" DROP COLUMN "verifiedById";
