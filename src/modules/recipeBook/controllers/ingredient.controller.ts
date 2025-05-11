import { Request, Response } from "express";
import IngredientService from "../services/ingredient.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const ingredientService = new IngredientService();
const logger = new LoggerService("Ingredient");

export default class IngredientController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const ingredient = await ingredientService.create(body);
      logger.info("Created", { id: ingredient.id });

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: ingredient,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while creating:", {
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      const dataIngredients = await ingredientService.get(query);
      logger.info("Retrieved", { count: dataIngredients.count });

      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataIngredients.count,
        data: dataIngredients.ingredients,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while fetching", {
        filter: req.query,
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      const ingredient = await ingredientService.patch(id, body);
      logger.info("Updated", { id: ingredient.id });

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: ingredient,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while updating", {
        id: Number(req.params.id),
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      const ingredient = await ingredientService.delete(id);
      logger.info("Deleted", { id: ingredient.id });

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: ingredient,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while deleting", {
        id: Number(req.params.id),
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }
}
