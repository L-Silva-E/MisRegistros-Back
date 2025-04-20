import { Request, Response } from "express";
import RecipeService from "../services/recipe.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";
import logger from "../../../config/logger";

const recipeService = new RecipeService();

export default class RecipeController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      logger.info("Creating recipe", { metadata: { body: body } });
      const recipe = await recipeService.create(body);

      logger.info("Recipe created", { metadata: { id: recipe.id } });
      const response: IResponse = {
        code: 201,
        message: "Created",
        data: recipe,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error creating recipe: ${error.message}`, {
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

      logger.info("Getting recipes", { metadata: { query: query } });
      const dataRecipes = await recipeService.get(query);

      logger.info("Recipes obtained", {
        metadata: { count: dataRecipes.count },
      });
      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataRecipes.count,
        data: dataRecipes.recipes,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error getting recipes: ${error.message}`, {
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

      logger.info(`Updating recipe`, { metadata: { id: id, body: body } });
      const recipe = await recipeService.patch(id, body);

      logger.info(`Recipe updated`, {
        metadata: { id: recipe.id },
      });
      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: recipe,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error updating recipe: ${error.message}`, {
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

      logger.info(`Deleting recipe`, { metadata: { id: id } });
      const recipe = await recipeService.delete(id);

      logger.info(`Recipe deleted`, { metadata: { id: recipe.id } });
      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: recipe,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error deleting recipe: ${error.message}`, {
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
