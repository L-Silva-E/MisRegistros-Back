import { Router } from "express";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";

import FeatureController from "../controllers/feature.controller";

import middlewareValidationSchema from "../../../shared/zod/middleware/schema.validation";
import {
  FeatureCreateZodSchema,
  FeatureGetZodSchema,
  FeatureUpdateZodSchema,
  FeatureDeleteZodSchema,
} from "../schema/feature.schema";

export default class FeatureRouter {
  private version: string;
  public router: Router;
  public controller: FeatureController;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.controller = new FeatureController();

    this.router.post(
      `/${this.version}/feature`,
      AuthorizationApiKey,
      middlewareValidationSchema(FeatureCreateZodSchema),
      this.controller.create
    );

    this.router.get(
      `/${this.version}/feature`,
      AuthorizationApiKey,
      middlewareValidationSchema(FeatureGetZodSchema),
      this.controller.get
    );

    this.router.patch(
      `/${this.version}/feature/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(FeatureUpdateZodSchema),
      this.controller.patch
    );

    this.router.delete(
      `/${this.version}/feature/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(FeatureDeleteZodSchema),
      this.controller.delete
    );
  }
}
