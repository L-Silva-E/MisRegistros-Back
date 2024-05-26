import { PrismaClient } from "@prisma/client";

import RecipeDomain from "../../../../domain/recipe.domain";
import IBaseRepository from "../../../../../../shared/interface/Ibase.repository";
import IResponse from "../../../../../../shared/interface/Iresponse";
import ErrorCodes from "../../../../../../shared/prisma/middlewares/error.codes";

export default class RecipeRepository implements IBaseRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  private getPagination = (page: number, limit: number) => {
    let skip = page ? page * limit : 0;
    let take = limit ? limit : 10;

    return { skip, take };
  };

  private getWhereParams = (params: any) => {
    delete params.from;
    delete params.to;
    delete params.orderByField;
    delete params.orderBy;
    delete params.page;
    delete params.limit;

    return { where: params };
  };

  public async create(recipe: RecipeDomain): Promise<IResponse> {
    try {
      const recipeCreated = await this.prisma.recipe.create({
        data: recipe.toJSON(),
      });

      return {
        code: 201,
        message: "Created",
        data: recipeCreated,
      };
    } catch (error: any) {
      await this.prisma.$disconnect();
      return ErrorCodes(error);
    }
  }

  public async get(params: any): Promise<IResponse> {
    try {
      const { skip, take } = this.getPagination(params.page, params.limit);
      const where = this.getWhereParams(params);

      const recipes = await this.prisma.recipe.findMany({
        ...where,
        skip,
        take,
      });

      return {
        code: 200,
        message: "OK",
        data: recipes,
      };
    } catch (error: any) {
      await this.prisma.$disconnect();
      return ErrorCodes(error);
    }
  }

  public async patch(id: number, recipe: RecipeDomain): Promise<IResponse> {
    try {
      const recipeUpdated = await this.prisma.recipe.update({
        where: { id },
        data: recipe.toJSON(),
      });

      return {
        code: 200,
        message: "OK",
        data: recipeUpdated,
      };
    } catch (error: any) {
      await this.prisma.$disconnect();
      return ErrorCodes(error);
    }
  }

  public async delete(id: number): Promise<IResponse> {
    try {
      const recipeDeleted = await this.prisma.recipe.delete({ where: { id } });

      return {
        code: 200,
        message: "OK",
        data: recipeDeleted,
      };
    } catch (error: any) {
      await this.prisma.$disconnect();
      return ErrorCodes(error);
    }
  }
}
