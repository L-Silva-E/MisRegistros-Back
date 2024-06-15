import { PrismaClient } from "@prisma/client";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import {
  RecipeModel,
  FullRecipeModel,
  RecipeCountModel,
} from "../models/recipe.model";

const prisma = new PrismaClient();

export default class RecipeService {
  public async create(recipe: FullRecipeModel): Promise<RecipeModel> {
    try {
      const ingredients = recipe.ingredients;
      const steps = recipe.steps;

      let recipeCreated = await prisma.recipe.create({
        data: {
          ...recipe,
          steps: {
            create: steps,
          },
          ingredients: {
            create: ingredients.map((ingredient) => ({
              quantity: ingredient.quantity,
              ingredient: {
                connect: {
                  id: ingredient.id,
                },
              },
            })),
          },
        },
      });

      recipeCreated = (await this.get({ id: recipeCreated.id }))
        .recipes[0] as RecipeModel & { createdAt: Date; updatedAt: Date };

      return recipeCreated;
    } catch (error) {
      throw error;
    }
  }

  public async get(query: any): Promise<RecipeCountModel> {
    try {
      const insensitiveFields = ["name", "description"];
      let queryOptions = getQueryOptions(query, insensitiveFields);

      queryOptions = {
        ...queryOptions,
        include: {
          ingredients: {
            select: {
              quantity: true,
              ingredient: { select: { name: true, unit: true } },
            },
          },
          steps: {
            select: { number: true, instruction: true },
          },
        },
      };

      const [recipes, count] = await prisma.$transaction([
        prisma.recipe.findMany(queryOptions),
        prisma.recipe.count(),
      ]);

      return { count, recipes: recipes };
    } catch (error) {
      throw error;
    }
  }

  public async patch(id: number, recipe: RecipeModel): Promise<RecipeModel> {
    try {
      const recipeUpdated = await prisma.recipe.update({
        where: { id },
        data: recipe,
        include: {
          ingredients: {
            select: {
              quantity: true,
              ingredient: { select: { name: true, unit: true } },
            },
          },
          steps: {
            select: { number: true, instruction: true },
          },
        },
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
        include: {
          ingredients: {
            select: {
              quantity: true,
              ingredient: { select: { name: true, unit: true } },
            },
          },
          steps: {
            select: { number: true, instruction: true },
          },
        },
      });

      return recipeDeleted;
    } catch (error) {
      throw error;
    }
  }
}
