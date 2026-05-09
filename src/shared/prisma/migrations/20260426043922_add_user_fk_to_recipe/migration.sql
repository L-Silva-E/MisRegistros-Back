-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "idUser" INTEGER;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
