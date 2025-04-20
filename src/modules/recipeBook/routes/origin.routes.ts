import { Router } from "express";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";

import OriginController from "../controllers/origin.controller";

import middlewareValidationSchema from "../../../shared/zod/middleware/schema.validation";
import {
  OriginCreateZodSchema,
  OriginGetZodSchema,
  OriginUpdateZodSchema,
  OriginDeleteZodSchema,
} from "../schema/origin.schema";

export default class OriginRouter {
  private version: string;
  public router: Router;
  public controller: OriginController;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.controller = new OriginController();

    this.router.post(
      `/${this.version}/origin`,
      AuthorizationApiKey,
      middlewareValidationSchema(OriginCreateZodSchema),
      this.controller.create
    );

    this.router.get(
      `/${this.version}/origin`,
      AuthorizationApiKey,
      middlewareValidationSchema(OriginGetZodSchema),
      this.controller.get
    );

    this.router.patch(
      `/${this.version}/origin/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(OriginUpdateZodSchema),
      this.controller.patch
    );

    this.router.delete(
      `/${this.version}/origin/:id`,
      AuthorizationApiKey,
      middlewareValidationSchema(OriginDeleteZodSchema),
      this.controller.delete
    );
  }
}
