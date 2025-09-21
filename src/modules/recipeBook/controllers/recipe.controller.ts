import { Request, Response } from "express";
import RecipeService from "../services/recipe.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import {
  CollectionResponse,
  ItemResponse,
  DeleteResponse,
} from "../../../shared/interfaces/api.response";

const recipeService = new RecipeService();
const logger = new LoggerService("Recipe");

export default class RecipeController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const recipe = await recipeService.create(body);
      logger.info("Created", { id: recipe.id });

      const response: ItemResponse<typeof recipe> = {
        data: recipe,
      };

      return res.status(201).send(response);
    } catch (error: unknown) {
      logger.error("Error while creating", {
        body: req.body,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error))
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      const dataRecipes = await recipeService.get(query);
      logger.info("Retrieved", { count: dataRecipes.count });

      const response: CollectionResponse<(typeof dataRecipes.recipes)[0]> = {
        count: dataRecipes.count,
        data: dataRecipes.recipes,
      };

      return res.status(200).send(response);
    } catch (error: unknown) {
      logger.error("Error while fetching", {
        filter: req.query,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : "UnknownError",
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error))
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      const recipe = await recipeService.patch(id, body);
      logger.info("Updated", { id: recipe.id });

      const response: ItemResponse<typeof recipe> = {
        data: recipe,
      };

      return res.status(200).send(response);
    } catch (error: unknown) {
      logger.error("Error while updating", {
        id: Number(req.params.id),
        body: req.body,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error))
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      const recipe = await recipeService.delete(id);
      logger.info("Deleted", { id: recipe.id });

      const response: DeleteResponse = {
        deleted: true,
        id: recipe.id!,
      };

      return res.status(200).send(response);
    } catch (error: unknown) {
      logger.error("Error while deleting", {
        id: Number(req.params.id),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error))
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }

  public async duplicate(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      const duplicatedRecipe = await recipeService.duplicate(id);
      logger.info("Recipe duplicated for editing", { originalId: id });

      const response: ItemResponse<typeof duplicatedRecipe> = {
        data: duplicatedRecipe,
      };

      return res.status(200).send(response);
    } catch (error: unknown) {
      logger.error("Error while duplicating recipe", {
        id: Number(req.params.id),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorBody = ErrorCodes(
        error instanceof Error ? error : new Error(String(error))
      );
      return res.status(errorBody.code).send(errorBody.response);
    }
  }
}
