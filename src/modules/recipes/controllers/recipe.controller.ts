import { Request, Response } from "express";
import RecipeService from "../services/recipe.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interface/Iresponse";

const recipeService = new RecipeService();

export default class RecipeController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      const recipe = await recipeService.create(body);

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: recipe,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(_req: Request, res: Response): Promise<Response> {
    try {
      const recipes = await recipeService.get();

      const response: IResponse = {
        code: 200,
        message: "Done",
        data: recipes,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const recipe = await recipeService.patch(Number(params.id), body);

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: recipe,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const recipe = await recipeService.delete(Number(params.id));

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: recipe,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }
}
