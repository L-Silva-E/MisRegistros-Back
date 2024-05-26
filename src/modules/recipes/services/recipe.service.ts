import { PrismaClient } from "@prisma/client";
import RecipeModel from "../models/recipe.model";

const prisma = new PrismaClient();

export default class RecipeService {
  public async create(recipe: RecipeModel): Promise<RecipeModel> {
    const recipeCreated = await prisma.recipe.create({ data: recipe });

    return recipeCreated;
  }

  public async get(): Promise<RecipeModel[]> {
    const recipes = await prisma.recipe.findMany();

    return recipes;
  }

  public async patch(id: number, recipe: RecipeModel): Promise<RecipeModel> {
    const recipeUpdated = await prisma.recipe.update({
      where: { id },
      data: recipe,
    });

    return recipeUpdated;
  }

  public async delete(id: number): Promise<RecipeModel> {
    const recipeDeleted = await prisma.recipe.delete({
      where: { id },
    });

    return recipeDeleted;
  }
}
