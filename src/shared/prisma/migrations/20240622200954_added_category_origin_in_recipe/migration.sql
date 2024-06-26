/*
  Warnings:

  - Added the required column `category` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL;
