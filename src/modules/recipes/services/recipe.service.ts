import { PrismaClient } from "@prisma/client";
import RecipeModel from "../models/recipe.model";

const prisma = new PrismaClient();

export default class RecipeService {
  public async create(recipe: RecipeModel): Promise<RecipeModel> {
    try {
      const recipeCreated = await prisma.recipe.create({
        data: recipe,
      });

      return recipeCreated;
    } catch (error) {
      throw error;
    }
  }

  public async get(): Promise<RecipeModel[]> {
    try {
      const recipes = await prisma.recipe.findMany();

      return recipes;
    } catch (error) {
      throw error;
    }
  }

  public async patch(id: number, recipe: RecipeModel): Promise<RecipeModel> {
    try {
      const recipeUpdated = await prisma.recipe.update({
        where: { id },
        data: recipe,
      });

      return recipeUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<RecipeModel> {
    try {
      const recipeDeleted = await prisma.recipe.delete({
        where: { id },
      });

      return recipeDeleted;
    } catch (error) {
      throw error;
    }
  }
}
