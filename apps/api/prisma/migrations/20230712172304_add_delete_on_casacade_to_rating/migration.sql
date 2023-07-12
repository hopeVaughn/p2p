-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_bathroomId_fkey";

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_bathroomId_fkey" FOREIGN KEY ("bathroomId") REFERENCES "Bathroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
