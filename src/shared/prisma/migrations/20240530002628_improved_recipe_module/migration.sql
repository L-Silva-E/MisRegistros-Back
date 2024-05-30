/*
  Warnings:

  - You are about to drop the column `directions` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `ingredients` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `name` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "directions",
DROP COLUMN "ingredients",
DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateTable
CREATE TABLE "RecipeIgnredient" (
    "idRecipe" INTEGER NOT NULL,
    "idIngredient" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RecipeIgnredient_pkey" PRIMARY KEY ("idIngredient","idRecipe")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" SERIAL NOT NULL,
    "idRecipe" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeIgnredient" ADD CONSTRAINT "RecipeIgnredient_idRecipe_fkey" FOREIGN KEY ("idRecipe") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIgnredient" ADD CONSTRAINT "RecipeIgnredient_idIngredient_fkey" FOREIGN KEY ("idIngredient") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_idRecipe_fkey" FOREIGN KEY ("idRecipe") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
