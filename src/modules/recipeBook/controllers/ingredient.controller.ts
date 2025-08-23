import { Request, Response } from "express";
import IngredientService from "../services/ingredient.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import {
  CollectionResponse,
  ItemResponse,
  DeleteResponse,
} from "../../../shared/interfaces/api.response";

const ingredientService = new IngredientService();
const logger = new LoggerService("Ingredient");

export default class IngredientController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const ingredient = await ingredientService.create(body);
      logger.info("Created", { id: ingredient.id });

      const response: ItemResponse<typeof ingredient> = {
        data: ingredient,
      };

      return res.status(201).send(response);
    } catch (error: any) {
      logger.error("Error while creating:", {
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      const dataIngredients = await ingredientService.get(query);
      logger.info("Retrieved", { count: dataIngredients.count });

      const response: CollectionResponse<
        (typeof dataIngredients.ingredients)[0]
      > = {
        count: dataIngredients.count,
        data: dataIngredients.ingredients,
      };

      return res.status(200).send(response);
    } catch (error: any) {
      logger.error("Error while fetching", {
        filter: req.query,
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      const ingredient = await ingredientService.patch(id, body);
      logger.info("Updated", { id: ingredient.id });

      const response: ItemResponse<typeof ingredient> = {
        data: ingredient,
      };

      return res.status(200).send(response);
    } catch (error: any) {
      logger.error("Error while updating", {
        id: Number(req.params.id),
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      const ingredient = await ingredientService.delete(id);
      logger.info("Deleted", { id: ingredient.id });

      const response: DeleteResponse = {
        deleted: true,
        id: ingredient.id!,
      };

      return res.status(200).send(response);
    } catch (error: any) {
      logger.error("Error while deleting", {
        id: Number(req.params.id),
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody.response);
    }
  }
}
