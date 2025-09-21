import { PrismaClient } from "@prisma/client";
import { Context } from "../../../shared/jest/context";
import {
  MetadataWithUsageResponse,
  IngredientWithUsage,
  CategoryWithUsage,
  OriginWithUsage,
} from "../models/metadata.model";

const prismaClient = new PrismaClient();

export default class MetadataService {
  public async getMetadataWithUsageCount(
    ctx?: Context
  ): Promise<MetadataWithUsageResponse> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const ingredientsWithUsage = await prisma.ingredient.findMany({
        select: {
          id: true,
          name: true,
          unit: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              recipes: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      const categoriesWithUsage = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              recipes: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      const originsWithUsage = await prisma.origin.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              recipes: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      const ingredients: IngredientWithUsage[] = ingredientsWithUsage.map(
        (ingredient) => ({
          id: ingredient.id,
          name: ingredient.name,
          unit: ingredient.unit,
          usageCount: ingredient._count.recipes,
          createdAt: ingredient.createdAt,
          updatedAt: ingredient.updatedAt,
        })
      );

      const categories: CategoryWithUsage[] = categoriesWithUsage.map(
        (category) => ({
          id: category.id,
          name: category.name,
          usageCount: category._count.recipes,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        })
      );

      const origins: OriginWithUsage[] = originsWithUsage.map((origin) => ({
        id: origin.id,
        name: origin.name,
        usageCount: origin._count.recipes,
        createdAt: origin.createdAt,
        updatedAt: origin.updatedAt,
      }));

      return {
        ingredients,
        categories,
        origins,
      };
    } catch (error) {
      throw error;
    }
  }
}
