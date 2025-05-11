import { Request, Response } from "express";
import StepService from "../services/step.service";
import LoggerService from "../../../services/logger";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";

const stepService = new StepService();
const logger = new LoggerService("Step");

export default class StepController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const step = await stepService.create(body);
      logger.info("Created", { id: step.id });

      const response: IResponse = {
        code: 201,
        message: "Created",
        data: step,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while creating:", {
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      const dataSteps = await stepService.get(query);
      logger.info("Retrieved", { count: dataSteps.count });

      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataSteps.count,
        data: dataSteps.steps,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while fetching", {
        filter: req.query,
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      const step = await stepService.patch(id, body);
      logger.info("Updated", { id: step.id });

      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: step,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while updating", {
        id: Number(req.params.id),
        body: req.body,
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      const step = await stepService.delete(id);
      logger.info("Deleted", { id: step.id });

      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: step,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error("Error while deleting", {
        id: Number(req.params.id),
        error: error.message,
        stack: error.stack,
      });

      const errorBody = ErrorCodes(error);
      return res.status(errorBody.code).send(errorBody);
    }
  }
}
