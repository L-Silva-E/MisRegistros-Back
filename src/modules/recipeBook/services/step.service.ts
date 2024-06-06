import { PrismaClient } from "@prisma/client";
import { getQueryOptions } from "../../../shared/prisma/utils/prisma.utils";
import { StepModel, StepCountModel } from "../models/step.model";

const prisma = new PrismaClient();

export default class StepService {
  public async create(step: StepModel): Promise<StepModel> {
    try {
      const stepCreated = await prisma.step.create({
        data: step,
      });

      return stepCreated;
    } catch (error) {
      throw error;
    }
  }

  public async get(query: any): Promise<StepCountModel> {
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

  public async patch(id: number, step: StepModel): Promise<StepModel> {
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

  public async delete(id: number): Promise<StepModel> {
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
