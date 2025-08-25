import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ErrorResponse } from "../../interfaces/api.response";
import LoggerService from "../../../services/logger";

const logger = new LoggerService("SchemaValidation");

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
      let apiError: ErrorResponse = {
        error: "Internal Server Error",
        details: error.message,
      };

      let statusCode = 500;

      if (error instanceof z.ZodError) {
        statusCode = 400;
        apiError = {
          error: "Bad Request",
          details: "Validation failed",
          field: error.issues[0]?.path.join(".") || undefined,
        };
      }

      logger.error("Unexpected error in validation middleware", {
        endpoint: req.originalUrl,
        message: error.message,
      });

      return res.status(statusCode).send(apiError);
    }
  };

export default validateSchemas;
