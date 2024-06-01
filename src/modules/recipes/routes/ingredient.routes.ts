import { Router } from "express";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";

import IngredientController from "../controllers/ingredient.controller";

import middlewareValidationSchema from "../../../shared/zod/middleware/schema.validation";
import {
  IngredientCreateZodSchema,
  IngredientGetZodSchema,
  IngredientUpdateZodSchema,
  IngredientDeleteZodSchema,
} from "../schema/ingredient.schema";

export default class IngredientRouter {
  private version: string;
  public router: Router;
  public controller: IngredientController;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.controller = new IngredientController();

    this.router.post(
      `/${this.version}/ingredient`,
      AuthorizationApiKey,
      middlewareValidationSchema(IngredientCreateZodSchema),
      this.controller.create
    );

    this.router.get(
      `/${this.version}/ingredient`,
      AuthorizationApiKey,
      middlewareValidationSchema(IngredientGetZodSchema),
      this.controller.get
    );

    this.router.patch(
      `/${this.version}/ingredient/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(IngredientUpdateZodSchema),
      this.controller.patch
    );

    this.router.delete(
      `/${this.version}/ingredient/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(IngredientDeleteZodSchema),
      this.controller.delete
    );
  }
}
