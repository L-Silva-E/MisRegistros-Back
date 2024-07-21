import { PrismaClient } from "@prisma/client";
import { Context } from "../../../shared/jest/context";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import { FeatureModel, FeatureCountModel } from "../models/feature.model";

const prismaClient = new PrismaClient();

export default class FeatureService {
  public async create(
    feature: FeatureModel,
    ctx?: Context
  ): Promise<FeatureModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const featureCreated = await prisma.feature.create({
        data: feature,
      });

      return featureCreated;
    } catch (error) {
      throw error;
    }
  }

  public async get(query: any, ctx?: Context): Promise<FeatureCountModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const insensitiveFields = ["name"];
      const queryOptions = getQueryOptions(query, insensitiveFields);

      const [features, count] = await prisma.$transaction([
        prisma.feature.findMany(queryOptions),
        prisma.feature.count(),
      ]);

      return { count, features: features };
    } catch (error) {
      throw error;
    }
  }

  public async patch(
    id: number,
    feature: FeatureModel,
    ctx?: Context
  ): Promise<FeatureModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const featureUpdated = await prisma.feature.update({
        where: { id },
        data: feature,
      });

      return featureUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number, ctx?: Context): Promise<FeatureModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const featureDeleted = await prisma.feature.delete({
        where: { id },
      });

      return featureDeleted;
    } catch (error) {
      throw error;
    }
  }
}
