import { PrismaClient } from "@prisma/client";
import { Context } from "../../../shared/jest/context";
import { QueryParams } from "../../../shared/prisma/interfaces/query.types";
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
    ctx?: Context,
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

  public async get(
    query: QueryParams,
    ctx?: Context,
  ): Promise<RecipeCountModel> {
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
        prisma.recipe.count({ where: queryOptions.where }),
      ]);

      return { count, recipes: recipes };
    } catch (error) {
      throw error;
    }
  }

  public async findById(
    id: number,
    ctx?: Context,
  ): Promise<RecipeModel | null> {
    const prisma = ctx?.prisma || prismaClient;
    return prisma.recipe.findUnique({ where: { id } });
  }

  public async patch(
    id: number,
    recipe: FullRecipeModel,
    ctx?: Context,
    idUser?: number,
  ): Promise<FullRecipeModel> {
    const prisma = ctx?.prisma || prismaClient;
    const stepsWithNumbers = assignStepNumbers(recipe.steps || []);

    const data = {
      ...recipe,
      steps: { deleteMany: {}, create: stepsWithNumbers },
      ingredients: {
        deleteMany: {},
        create: recipe.ingredients.map((ingredient) => ({
          quantity: ingredient.quantity,
          ingredient: { connect: { id: ingredient.id } },
        })),
      },
    };

    const include = {
      category: { select: { name: true } },
      origin: { select: { name: true } },
      ingredients: {
        select: {
          quantity: true,
          ingredient: { select: { id: true, name: true, unit: true } },
        },
      },
      steps: { select: { number: true, instruction: true } },
    };

    if (idUser !== undefined) {
      return prisma.$transaction(async (tx) => {
        const existing = await tx.recipe.findUnique({
          where: { id },
          select: { idUser: true },
        });
        if (!existing) throw new Error("RECIPE_NOT_FOUND");
        if (existing.idUser !== idUser) throw new Error("RECIPE_FORBIDDEN");
        return tx.recipe.update({ where: { id }, data, include });
      }) as Promise<FullRecipeModel>;
    }

    return prisma.recipe.update({
      where: { id },
      data,
      include,
    }) as Promise<FullRecipeModel>;
  }

  public async delete(
    id: number,
    ctx?: Context,
    idUser?: number,
  ): Promise<RecipeModel> {
    const prisma = ctx?.prisma || prismaClient;

    const include = {
      category: { select: { name: true } },
      origin: { select: { name: true } },
      ingredients: {
        select: {
          quantity: true,
          ingredient: { select: { id: true, name: true, unit: true } },
        },
      },
      steps: { select: { number: true, instruction: true } },
    };

    if (idUser !== undefined) {
      return prisma.$transaction(async (tx) => {
        const existing = await tx.recipe.findUnique({
          where: { id },
          select: { idUser: true },
        });
        if (!existing) throw new Error("RECIPE_NOT_FOUND");
        if (existing.idUser !== idUser) throw new Error("RECIPE_FORBIDDEN");
        return tx.recipe.delete({ where: { id }, include });
      }) as Promise<RecipeModel>;
    }

    return prisma.recipe.delete({
      where: { id },
      include,
    }) as Promise<RecipeModel>;
  }
}
