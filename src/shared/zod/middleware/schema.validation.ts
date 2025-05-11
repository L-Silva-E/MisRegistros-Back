import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import IResponse from "../../interfaces/Iresponse";
import LoggerService from "../../../services/logger";

const logger = new LoggerService("Step");

const validateSchemas =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body || null;
      const params = req.params || null;
      const query = req.query || null;
      const headers = req.headers || null;

      const result = schema.parse({
        body: body,
        params: params,
        query: query,
        headers: headers,
      });

      req.body = result.body;
      req.params = result.params;
      req.query = result.query;
      req.headers = result.headers;

      return next();
    } catch (error: any) {
      const apiError: IResponse = {
        code: 500,
        message: "Error internal server",
        data: {},
        stackError: error.message,
      };

      if (error instanceof z.ZodError) {
        apiError.code = 400;
        apiError.message = "Bad request";
        apiError.stackError = error.issues;
      }

      logger.error("Unexpected error in validation middleware", {
        endpoint: req.originalUrl,
        message: error.message,
      });

      return res.status(apiError.code).send(apiError);
    }
  };

export default validateSchemas;
