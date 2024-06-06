import { Request, Response } from "express";
import StepService from "../services/step.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const stepService = new StepService();

export default class StepController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      const step = await stepService.create(body);

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: step,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;
      const dataSteps = await stepService.get(query);

      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataSteps.count,
        data: dataSteps.steps,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const step = await stepService.patch(Number(params.id), body);

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: step,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const step = await stepService.delete(Number(params.id));

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: step,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }
}
