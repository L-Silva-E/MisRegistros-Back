import { Prisma } from "@prisma/client";
import IResponse from "../../interfaces/Iresponse";

const ErrorCodes = (err: Error): IResponse => {
  const stringError = err.message.toString();
  const splitError = stringError.replace(/\n/gi, "").split(":");
  const customError = splitError;

  let response: IResponse = {
    code: 500,
    message: "Internal Server Error",
    data: {},
    stackError: { message: customError },
  };

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    response.code = 400;
    response.message = "Bad Request";
    response.stackError = err.message;

    if (err.code == "P2025") {
      response.code = 404;
      response.message = "Not Found";
    }
    if (err.code == "P1008" || err.code == "P5009") {
      response.code = 408;
      response.message = "Request Timeout";
    }
    if (err.code == "P2002") {
      response.code = 409;
      response.message = "Conflict Unique Constraint";
    }
    if (err.code == "P2028" || err.code == "P5015") {
      response.code = 500;
      response.message = "Internal Server Error";
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    response.code = 400;
    response.message = "Bad Request";
    response.stackError.message = customError;
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    response.code = 500;
    response.message = "Internal Server Error";
    response.stackError.message = "Unknown Prisma Code Error" + customError;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    response.code = 500;
    response.message = "Internal Server Error";
    response.stackError.message = "Prisma Initialization Error" + customError;
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    response.code = 500;
    response.message = "Internal Server Error";
    response.stackError.message = "Database Connection Error" + customError;
  }

  return response;
};

export default ErrorCodes;
