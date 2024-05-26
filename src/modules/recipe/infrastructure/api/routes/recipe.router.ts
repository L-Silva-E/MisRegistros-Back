import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import RecipeRepository from "../../../infrastructure/adapters/prisma/repository/recipe.repository";
import RecipeApplication from "../../../application/recipe.application";
import RecipeController from "../controllers/recipe.controller";

const prisma = new PrismaClient();

export default class RecipeRouter {
  private version: string;
  public router: Router;
  public RecipeRepository: RecipeRepository;
  public RecipeApplication: RecipeApplication;
  public controller: RecipeController;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.RecipeRepository = new RecipeRepository();
    this.RecipeApplication = new RecipeApplication(this.RecipeRepository);
    this.controller = new RecipeController(this.RecipeApplication);

    this.router.post(`/${this.version}/recipe`, this.post);
    this.router.get(`/${this.version}/recipe`, this.get);
  }

  post = async (req: Request, resp: Response): Promise<Response> => {
    try {
      const { body } = req;
      const recipe = await this.controller.create(body);

      const response = {
        code: 201,
        message: "Created",
        data: recipe,
      };
      return resp.status(response.code).send(response);
    } catch (error) {
      const errorBody = {
        code: 500,
        message: "Ha ocurrido un error",
        data: {},
      };
      return resp.status(errorBody.code).send(errorBody);
    }
  };

  get = async (_req: Request, resp: Response): Promise<Response> => {
    try {
      const recipes = await prisma.recipe.findMany();

      const response = {
        code: 200,
        message: "OK",
        data: recipes,
      };
      return resp.status(response.code).send(response);
    } catch (error) {
      const errorBody = {
        code: 500,
        message: "Ha ocurrido un error",
        data: {},
      };
      return resp.status(errorBody.code).send(errorBody);
    }
  };
}
