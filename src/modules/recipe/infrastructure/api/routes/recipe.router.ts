import { Router, Request, Response } from "express";

export default class RecipeRouter {
  public router: Router;
  private version: string;

  constructor(version: string) {
    this.version = version;
    this.router = Router();
    this.router.get(`/${this.version}/recipe`, this.get);
  }

  get = async (_req: Request, resp: Response): Promise<Response> => {
    try {
      const response = {
        code: 200,
        message: "OK",
        data: {},
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
