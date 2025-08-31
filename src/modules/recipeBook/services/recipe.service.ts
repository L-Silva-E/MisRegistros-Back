import { PrismaClient } from "@prisma/client";
import { Context } from "../../../shared/jest/context";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import {
  RecipeModel,
  FullRecipeModel,
  RecipeCountModel,
} from "../models/recipe.model";
import { assignStepNumbers } from "../utils/recipe.utils";

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
      const stepsWithNumbers = assignStepNumbers(steps || []);

      let recipeCreated = await prisma.recipe.create({
        data: {
          ...recipe,
          steps: { create: stepsWithNumbers },
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
        include: {
          category: {
            select: { name: true },
          },
          origin: {
            select: { name: true },
          },
          ingredients: {
            select: {
              quantity: true,
              ingredient: { select: { id: true, name: true, unit: true } },
            },
          },
          steps: {
            select: { number: true, instruction: true },
          },
        },
      });

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
          category: {
            select: { name: true },
          },
          origin: {
            select: { name: true },
          },
          ingredients: {
            select: {
              quantity: true,
              ingredient: { select: { id: true, name: true, unit: true } },
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
    recipe: FullRecipeModel,
    ctx?: Context
  ): Promise<FullRecipeModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const stepsWithNumbers = assignStepNumbers(recipe.steps || []);

      const recipeUpdated = await prisma.recipe.update({
        where: { id },
        data: {
          ...recipe,
          steps: {
            deleteMany: {},
            create: stepsWithNumbers,
          },
          ingredients: {
            deleteMany: {},
            create: recipe.ingredients.map((ingredient) => ({
              quantity: ingredient.quantity,
              ingredient: {
                connect: {
                  id: ingredient.id,
                },
              },
            })),
          },
        },
        include: {
          category: {
            select: { name: true },
          },
          origin: {
            select: { name: true },
          },
          ingredients: {
            select: {
              quantity: true,
              ingredient: { select: { id: true, name: true, unit: true } },
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
          category: {
            select: { name: true },
          },
          origin: {
            select: { name: true },
          },
          ingredients: {
            select: {
              quantity: true,
              ingredient: { select: { id: true, name: true, unit: true } },
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
