import { Router } from "express";
import RecipeController from "../controllers/recipe.controller";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";

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
      this.controller.create
    );

    this.router.get(
      `/${this.version}/recipe`,
      AuthorizationApiKey,
      this.controller.get
    );

    this.router.patch(
      `/${this.version}/recipe/:id`,
      AuthorizationApiKey,
      this.controller.patch
    );

    this.router.delete(
      `/${this.version}/recipe/:id`,
      AuthorizationApiKey,
      this.controller.delete
    );
  }
}
