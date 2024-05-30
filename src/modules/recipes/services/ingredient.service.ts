import { PrismaClient } from "@prisma/client";
import IngredientModel from "../models/ingredient.model";

const prisma = new PrismaClient();

export default class IngredientService {
  public async create(ingredient: IngredientModel): Promise<IngredientModel> {
    try {
      const ingredientCreated = await prisma.ingredient.create({
        data: ingredient,
      });

      return ingredientCreated;
    } catch (error) {
      throw error;
    }
  }

  public async get(): Promise<IngredientModel[]> {
    try {
      const ingredients = await prisma.ingredient.findMany();

      return ingredients;
    } catch (error) {
      throw error;
    }
  }

  public async patch(
    id: number,
    ingredient: IngredientModel
  ): Promise<IngredientModel> {
    try {
      const ingredientUpdated = await prisma.ingredient.update({
        where: { id },
        data: ingredient,
      });

      return ingredientUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<IngredientModel> {
    try {
      const ingredientDeleted = await prisma.ingredient.delete({
        where: { id },
      });

      return ingredientDeleted;
    } catch (error) {
      throw error;
    }
  }
}
