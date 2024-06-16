import { PrismaClient } from "@prisma/client";
import { Context } from "../../../shared/jest/context";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import {
  RecipeModel,
  FullRecipeModel,
  RecipeCountModel,
} from "../models/recipe.model";

const prismaClient = new PrismaClient();

export default class RecipeService {
  public async create(
    recipe: FullRecipeModel,
    ctx?: Context
  ): Promise<RecipeModel> {
    const prisma = ctx?.prisma || prismaClient;

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

  public async get(query: any, ctx?: Context): Promise<RecipeCountModel> {
    const prisma = ctx?.prisma || prismaClient;

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

  public async patch(
    id: number,
    recipe: RecipeModel,
    ctx?: Context
  ): Promise<RecipeModel> {
    const prisma = ctx?.prisma || prismaClient;

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

  public async delete(id: number, ctx?: Context): Promise<RecipeModel> {
    const prisma = ctx?.prisma || prismaClient;

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
