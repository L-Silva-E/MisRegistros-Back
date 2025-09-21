import { Router } from "express";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";

import MetadataController from "../controllers/metadata.controller";

export default class MetadataRouter {
  private version: string;
  public router: Router;
  public controller: MetadataController;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.controller = new MetadataController();

    this.router.get(
      `/${this.version}/metadata/usage-count`,
      AuthorizationApiKey,
      this.controller.getWithUsageCount
    );
  }
}
