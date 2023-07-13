-- DropForeignKey
ALTER TABLE "Bathroom" DROP CONSTRAINT "Bathroom_createdById_fkey";

-- AlterTable
ALTER TABLE "Bathroom" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bathroom" ADD CONSTRAINT "Bathroom_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
