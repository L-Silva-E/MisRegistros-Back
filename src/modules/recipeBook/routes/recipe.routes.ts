import { Router } from "express";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";
import authMiddleware, {
  optionalAuthMiddleware,
} from "../../../middleware/auth.middleware";
import uploadMiddleware from "../../../middleware/upload.middleware";

import RecipeController from "../controllers/recipe.controller";

import middlewareValidationSchema from "../../../shared/zod/middleware/schema.validation";
import {
  RecipeCreateZodSchema,
  RecipeGetZodSchema,
  RecipeUpdateZodSchema,
  RecipeDeleteZodSchema,
} from "../schema/recipe.schema";

export default class RecipeRouter {
  private version: string;
  public router: Router;
  public controller: RecipeController;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.controller = new RecipeController();

    this.router.post(
      `/${this.version}/recipe`,
      AuthorizationApiKey,
      authMiddleware,
      uploadMiddleware,
      middlewareValidationSchema(RecipeCreateZodSchema),
      this.controller.create,
    );

    this.router.get(
      `/${this.version}/recipe`,
      AuthorizationApiKey,
      optionalAuthMiddleware,
      middlewareValidationSchema(RecipeGetZodSchema),
      this.controller.get,
    );

    this.router.patch(
      `/${this.version}/recipe/:id`,
      AuthorizationApiKey,
      authMiddleware,
      middlewareValidationSchema(RecipeUpdateZodSchema),
      this.controller.patch,
    );

    this.router.delete(
      `/${this.version}/recipe/:id`,
      AuthorizationApiKey,
      authMiddleware,
      middlewareValidationSchema(RecipeDeleteZodSchema),
      this.controller.delete,
    );
  }
}
