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
        const detailMessage = "Validation failed";
        statusCode = 400;

        apiError = {
          error: "Bad Request",
          details: detailMessage,
          validation: error.issues.map((issue) => ({
            path: issue.path.join("."),
            code: issue.code,
            expected: (issue as any)?.expected || undefined,
            received: (issue as any)?.received || undefined,
            message: issue.message,
          })),
        };

        logger.error(detailMessage, {
          endpoint: req.originalUrl,
          method: req.method,
          validationErrors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            code: issue.code,
            message: issue.message,
          })),
          totalErrors: error.issues.length,
        });
      } else {
        logger.error("Unexpected error in validation middleware", {
          endpoint: req.originalUrl,
          method: req.method,
          message: error.message,
          stack: error.stack,
        });
      }

      return res.status(statusCode).send(apiError);
    }
  };

export default validateSchemas;
