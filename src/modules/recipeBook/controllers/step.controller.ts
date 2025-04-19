import { Request, Response } from "express";
import StepService from "../services/step.service";
import ErrorCodes from "../../../shared/prisma/middlewares/error.codes";
import IResponse from "../../../shared/interfaces/Iresponse";
import logger from "../../../config/logger";

const stepService = new StepService();

export default class StepController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      logger.info("Creating step", { metadata: { body: body } });
      const step = await stepService.create(body);

      logger.info("Step created", { metadata: { id: step.id } });
      const response: IResponse = {
        code: 201,
        message: "Created",
        data: step,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error creating step: ${error.message}`, {
        metadata: {
          body: req.body,
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req;

      logger.info("Getting steps", { metadata: { query: query } });
      const dataSteps = await stepService.get(query);

      logger.info("Steps obtained", {
        metadata: { count: dataSteps.count },
      });
      const response: IResponse = {
        code: 200,
        message: "Done",
        count: dataSteps.count,
        data: dataSteps.steps,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error getting steps: ${error.message}`, {
        metadata: {
          method: "get",
          query: req.query,
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async patch(req: Request, res: Response): Promise<Response> {
    try {
      const { body, params } = req;
      const id = Number(params.id);

      logger.info(`Updating step`, { metadata: { id: id, body: body } });
      const step = await stepService.patch(id, body);

      logger.info(`Step updated`, {
        metadata: { id: step.id },
      });
      const response: IResponse = {
        code: 200,
        message: "Updated",
        data: step,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error updating step: ${error.message}`, {
        metadata: {
          id: Number(req.params.id),
          body: req.body,
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const id = Number(params.id);

      logger.info(`Deleting step`, { metadata: { id: id } });
      const step = await stepService.delete(id);

      logger.info(`Step deleted`, { metadata: { id: step.id } });
      const response: IResponse = {
        code: 200,
        message: "Deleted",
        data: step,
      };

      return res.status(response.code).send(response);
    } catch (error: any) {
      logger.error(`Error deleting step: ${error.message}`, {
        metadata: {
          id: Number(req.params.id),
          error: error.message,
          stack: error.stack,
        },
      });

      const errorBody = ErrorCodes(error);

      return res.status(errorBody.code).send(errorBody);
    }
  }
}
