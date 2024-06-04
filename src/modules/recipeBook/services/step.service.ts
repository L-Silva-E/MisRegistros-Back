import { PrismaClient } from "@prisma/client";
import StepModel from "../models/step.model";

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

  public async get(): Promise<StepModel[]> {
    try {
      const steps = await prisma.step.findMany();

      return steps;
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
