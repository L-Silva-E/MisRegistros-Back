import { Request, Response } from "express";
import IngredientService from "../services/ingredient.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";
import logger from "../../../config/logger";

const ingredientService = new IngredientService();

export default class IngredientController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      logger.info("Creating ingredient", { metadata: { body: body } });
      const ingredient = await ingredientService.create(body);

      logger.info("Ingredient created", { metadata: { id: ingredient.id } });
      const response: IResponse = {
        code: 201,
        message: "Created",
        data: ingredient,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error creating ingredient: ${error.message}`, {
        metadata: {
          body: req.body,
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      logger.info("Getting ingredients", { metadata: { query: query } });
      const dataIngredients = await ingredientService.get(query);

      logger.info("Ingredients obtained", {
        metadata: { count: dataIngredients.count },
      });
      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataIngredients.count,
        data: dataIngredients.ingredients,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error getting ingredients: ${error.message}`, {
        metadata: {
          method: "get",
          query: req.query,
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      logger.info(`Updating ingredient`, { metadata: { id: id, body: body } });
      const ingredient = await ingredientService.patch(id, body);

      logger.info(`Ingredient updated`, {
        metadata: { id: ingredient.id },
      });
      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: ingredient,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error updating ingredient: ${error.message}`, {
        metadata: {
          id: Number(req.params.id),
          body: req.body,
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      logger.info(`Deleting ingredient`, { metadata: { id: id } });
      const ingredient = await ingredientService.delete(id);

      logger.info(`Ingredient deleted`, { metadata: { id: ingredient.id } });
      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: ingredient,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error deleting ingredient: ${error.message}`, {
        metadata: {
          id: Number(req.params.id),
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }
}
