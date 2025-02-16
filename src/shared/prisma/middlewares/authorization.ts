import { NextFunction, Request, Response } from "express";
import IResponse from "../../../shared/interfaces/Iresponse";
import environment from "../../environment";

export default function AuthorizationApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const apiKey = req?.get("api-key");

  if (!apiKey || apiKey !== environment.API_KEY) {
    const apiError: IResponse = {
      code: 401,
      message: "Unauthorized",
      data: {},
    };

    return res.status(apiError.code).send(apiError);
  }

  next();
}
