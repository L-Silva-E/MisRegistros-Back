import { Router } from "express";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";

import StepController from "../controllers/step.controller";

import middlewareValidationSchema from "../../../shared/zod/middleware/schema.validation";
import {
  StepCreateZodSchema,
  StepGetZodSchema,
  StepUpdateZodSchema,
  StepDeleteZodSchema,
} from "../schema/step.schema";

export default class StepRouter {
  private version: string;
  public router: Router;
  public controller: StepController;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.controller = new StepController();

    this.router.post(
      `/${this.version}/step`,
      AuthorizationApiKey,
      middlewareValidationSchema(StepCreateZodSchema),
      this.controller.create
    );

    this.router.get(
      `/${this.version}/step`,
      AuthorizationApiKey,
      middlewareValidationSchema(StepGetZodSchema),
      this.controller.get
    );

    this.router.patch(
      `/${this.version}/step/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(StepUpdateZodSchema),
      this.controller.patch
    );

    this.router.delete(
      `/${this.version}/step/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(StepDeleteZodSchema),
      this.controller.delete
    );
  }
}
