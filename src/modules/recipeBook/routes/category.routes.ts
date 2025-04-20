import { Router } from "express";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";

import CategoryController from "../controllers/category.controller";

import middlewareValidationSchema from "../../../shared/zod/middleware/schema.validation";
import {
  CategoryCreateZodSchema,
  CategoryGetZodSchema,
  CategoryUpdateZodSchema,
  CategoryDeleteZodSchema,
} from "../schema/category.schema";

export default class CategoryRouter {
  private version: string;
  public router: Router;
  public controller: CategoryController;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.controller = new CategoryController();

    this.router.post(
      `/${this.version}/category`,
      AuthorizationApiKey,
      middlewareValidationSchema(CategoryCreateZodSchema),
      this.controller.create
    );

    this.router.get(
      `/${this.version}/category`,
      AuthorizationApiKey,
      middlewareValidationSchema(CategoryGetZodSchema),
      this.controller.get
    );

    this.router.patch(
      `/${this.version}/category/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(CategoryUpdateZodSchema),
      this.controller.patch
    );

    this.router.delete(
      `/${this.version}/category/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(CategoryDeleteZodSchema),
      this.controller.delete
    );
  }
}
