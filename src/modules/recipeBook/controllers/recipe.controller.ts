import { Request, Response } from "express";
import RecipeService from "../services/recipe.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const recipeService = new RecipeService();
const logger = new LoggerService("Recipe");

export default class RecipeController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const recipe = await recipeService.create(body);
      logger.info("Created", { id: recipe.id });

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: recipe,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while creating", {
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

      const dataRecipes = await recipeService.get(query);
      logger.info("Retrieved", { count: dataRecipes.count });

      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataRecipes.count,
        data: dataRecipes.recipes,
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

      const recipe = await recipeService.patch(id, body);
      logger.info("Updated", { id: recipe.id });

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: recipe,
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

      const recipe = await recipeService.delete(id);
      logger.info("Deleted", { id: recipe.id });

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: recipe,
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
