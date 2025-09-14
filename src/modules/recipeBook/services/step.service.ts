import { PrismaClient } from "@prisma/client";
import { Context } from "../../../shared/jest/context";
import { QueryParams } from "../../../shared/prisma/interfaces/query.types";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import { StepModel, StepCountModel } from "../models/step.model";

const prismaClient = new PrismaClient();

export default class StepService {
  public async create(step: StepModel, ctx?: Context): Promise<StepModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const stepCreated = await prisma.step.create({
        data: step,
      });

      return stepCreated;
    } catch (error) {
      throw error;
    }
  }

  public async get(query: QueryParams, ctx?: Context): Promise<StepCountModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const insensitiveFields = ["instruction"];
      const queryOptions = getQueryOptions(query, insensitiveFields);

      const [steps, count] = await prisma.$transaction([
        prisma.step.findMany(queryOptions),
        prisma.step.count(),
      ]);

      return { count, steps: steps };
    } catch (error) {
      throw error;
    }
  }

  public async patch(
    id: number,
    step: StepModel,
    ctx?: Context
  ): Promise<StepModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const stepUpdated = await prisma.step.update({
        where: { id },
        data: step,
      });

      return stepUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number, ctx?: Context): Promise<StepModel> {
    const prisma = ctx?.prisma || prismaClient;

    try {
      const stepDeleted = await prisma.step.delete({
        where: { id },
      });

      return stepDeleted;
    } catch (error) {
      throw error;
    }
  }
}
