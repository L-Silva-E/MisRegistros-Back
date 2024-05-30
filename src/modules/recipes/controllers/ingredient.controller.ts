import { Request, Response } from "express";
import IngredientService from "../services/ingredient.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const ingredientService = new IngredientService();

export default class IngredientController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      const ingredient = await ingredientService.create(body);

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: ingredient,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(_req: Request, res: Response): Promise<Response> {
    try {
      const ingredients = await ingredientService.get();

      const response: IResponse = {
        code: 200,
        message: "Done",
        data: ingredients,
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
      const ingredient = await ingredientService.patch(Number(params.id), body);

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: ingredient,
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
      const ingredient = await ingredientService.delete(Number(params.id));

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: ingredient,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }
}
