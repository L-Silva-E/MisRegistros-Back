import { Router } from "express";
import IngredientController from "../controllers/ingredient.controller";
import AuthorizationApiKey from "../../../shared/prisma/middlewares/authorization";

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
      this.controller.create
    );

    this.router.get(
      `/${this.version}/ingredient`,
      AuthorizationApiKey,
      this.controller.get
    );

    this.router.patch(
      `/${this.version}/ingredient/:id`,
      AuthorizationApiKey,
      this.controller.patch
    );

    this.router.delete(
      `/${this.version}/ingredient/:id`,
      AuthorizationApiKey,
      this.controller.delete
    );
  }
}
