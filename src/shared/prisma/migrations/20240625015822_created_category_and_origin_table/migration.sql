/*
  Warnings:

  - You are about to drop the column `category` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `idCategory` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idOrigin` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "category",
DROP COLUMN "origin",
ADD COLUMN     "idCategory" INTEGER NOT NULL,
ADD COLUMN     "idOrigin" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Origin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Origin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_idOrigin_fkey" FOREIGN KEY ("idOrigin") REFERENCES "Origin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
