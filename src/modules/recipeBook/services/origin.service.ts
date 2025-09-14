import { PrismaClient } from "@prisma/client";
import { Context } from "../../../shared/jest/context";
import { QueryParams } from "../../../shared/prisma/interfaces/Iquery";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import { OriginModel, OriginCountModel } from "../models/origin.model";

const prismaClient = new PrismaClient();

export default class OriginService {
  public async create(
    origin: OriginModel,
    ctx?: Context
  ): Promise<OriginModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const originCreated = await prisma.origin.create({
        data: origin,
      });

      return originCreated;
    } catch (error) {
      throw error;
    }
  }

  public async get(
    query: QueryParams,
    ctx?: Context
  ): Promise<OriginCountModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const insensitiveFields = ["name"];
      const queryOptions = getQueryOptions(query, insensitiveFields);

      const [origins, count] = await prisma.$transaction([
        prisma.origin.findMany(queryOptions),
        prisma.origin.count(),
      ]);

      return { count, origins: origins };
    } catch (error) {
      throw error;
    }
  }

  public async patch(
    id: number,
    origin: OriginModel,
    ctx?: Context
  ): Promise<OriginModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const originUpdated = await prisma.origin.update({
        where: { id },
        data: origin,
      });

      return originUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number, ctx?: Context): Promise<OriginModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const originDeleted = await prisma.origin.delete({
        where: { id },
      });

      return originDeleted;
    } catch (error) {
      throw error;
    }
  }
}
