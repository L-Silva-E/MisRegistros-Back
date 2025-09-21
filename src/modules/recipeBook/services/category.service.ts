import { PrismaClient } from "@prisma/client";
import { Context } from "../../../shared/jest/context";
import { QueryParams } from "../../../shared/prisma/interfaces/query.types";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import { CategoryModel, CategoryCountModel } from "../models/category.model";

const prismaClient = new PrismaClient();

export default class CategoryService {
  public async create(
    category: CategoryModel,
    ctx?: Context
  ): Promise<CategoryModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const categoryCreated = await prisma.category.create({
        data: category,
      });

      return categoryCreated;
    } catch (error) {
      throw error;
    }
  }

  public async get(
    query: QueryParams,
    ctx?: Context
  ): Promise<CategoryCountModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const insensitiveFields = ["name"];
      const queryOptions = getQueryOptions(query, insensitiveFields);

      const [categories, count] = await prisma.$transaction([
        prisma.category.findMany(queryOptions),
        prisma.category.count(),
      ]);

      return { count, categories: categories };
    } catch (error) {
      throw error;
    }
  }

  public async patch(
    id: number,
    category: CategoryModel,
    ctx?: Context
  ): Promise<CategoryModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const categoryUpdated = await prisma.category.update({
        where: { id },
        data: category,
      });

      return categoryUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number, ctx?: Context): Promise<CategoryModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const categoryDeleted = await prisma.category.delete({
        where: { id },
      });

      return categoryDeleted;
    } catch (error) {
      throw error;
    }
  }
}
