import { PrismaClient } from "@prisma/client";
import { Context } from "../../../shared/jest/context";
import { QueryParams } from "../../../shared/prisma/interfaces/query.types";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import {
  IngredientModel,
  IngredientCountModel,
} from "../models/ingredient.model";

const prismaClient = new PrismaClient();

export default class IngredientService {
  public async create(
    ingredient: IngredientModel,
    ctx?: Context
  ): Promise<IngredientModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const ingredientCreated = await prisma.ingredient.create({
        data: ingredient,
      });

      return ingredientCreated;
    } catch (error) {
      throw error;
    }
  }

  public async get(
    query: QueryParams,
    ctx?: Context
  ): Promise<IngredientCountModel> {
    const prisma = ctx?.prisma || prismaClient;

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
    ingredient: IngredientModel,
    ctx?: Context
  ): Promise<IngredientModel> {
    const prisma = ctx?.prisma || prismaClient;

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

  public async delete(id: number, ctx?: Context): Promise<IngredientModel> {
    const prisma = ctx?.prisma || prismaClient;

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
