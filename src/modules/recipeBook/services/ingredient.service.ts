import { PrismaClient } from "@prisma/client";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import {
  IngredientModel,
  IngredientCountModel,
} from "../models/ingredient.model";

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

  public async get(query: any): Promise<IngredientCountModel> {
    try {
      const insensitiveFields = ["name"];
      const queryOptions = getQueryOptions(query, insensitiveFields);

      const [ingredients, count] = await prisma.$transaction([
        prisma.ingredient.findMany(queryOptions),
        prisma.ingredient.count(),
      ]);

      return { count, ingredients: ingredients };
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
