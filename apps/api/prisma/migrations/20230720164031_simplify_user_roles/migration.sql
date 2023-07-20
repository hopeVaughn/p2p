/*
  Warnings:

  - You are about to drop the column `roleId` on the `UserRole` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "roleId",
ADD COLUMN     "role" "RoleName" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Role";
