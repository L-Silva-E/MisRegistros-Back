import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import IResponse from "../../interfaces/Iresponse";

const validateSchemas =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body || null;
      const params = req.params || null;
      const query = req.query || null;
      const headers = req.headers || null;

      schema.parse({
        body: body,
        params: params,
        query: query,
        headers: headers,
      });

      return next();
    } catch (error: any) {
      const apiError: IResponse = {
        code: 500,
        message: "Error internal server 500",
        data: {},
        stackError: error.message,
      };

      if (error instanceof z.ZodError) {
        apiError.code = 400;
        apiError.message = "Bad request";
        apiError.stackError = error.issues;
      }

      return res.status(apiError.code).send(apiError);
    }
  };

export default validateSchemas;
