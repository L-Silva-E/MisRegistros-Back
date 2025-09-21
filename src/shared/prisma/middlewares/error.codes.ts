import { Prisma } from "@prisma/client";
import { ErrorWithCode } from "../../interfaces/api.response";

const ErrorCodes = (err: Error): ErrorWithCode => {
  const stringError = err.message.toString();
  const splitError = stringError.replace(/\n/gi, "").split(":");
  const customError = splitError;

  let result: ErrorWithCode = {
    code: 500,
    response: {
      error: "Internal Server Error",
      details: customError.join(": "),
    },
  };

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    result.code = 400;
    result.response.error = "Bad Request";
    result.response.details = err.message;

    if (err.code == "P2025") {
      result.code = 404;
      result.response.error = "Not Found";
      result.response.details = "The requested resource was not found";
    }
    if (err.code == "P1008" || err.code == "P5009") {
      result.code = 408;
      result.response.error = "Request Timeout";
      result.response.details = "Database connection timeout";
    }
    if (err.code == "P2002") {
      result.code = 409;
      result.response.error = "Conflict";
      result.response.details = "Unique constraint violation";
    }
    if (err.code == "P2003") {
      result.code = 409;
      result.response.error = "Conflict";
      if (err.message && err.message.includes("Cannot delete")) {
        result.response.details = err.message;
      } else {
        result.response.details =
          "Cannot delete this record because it is referenced by other records. Please remove the dependencies first.";
      }
    }
    if (err.code == "P2028" || err.code == "P5015") {
      result.code = 500;
      result.response.error = "Internal Server Error";
      result.response.details = "Database operation failed";
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    result.code = 400;
    result.response.error = "Bad Request";
    result.response.details = "Invalid data provided";
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    result.code = 500;
    result.response.error = "Internal Server Error";
    result.response.details = "Unknown database error occurred";
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    result.code = 500;
    result.response.error = "Internal Server Error";
    result.response.details = "Database initialization failed";
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    result.code = 500;
    result.response.error = "Internal Server Error";
    result.response.details = "Database connection error";
  }

  console.error(err);

  return result;
};

export default ErrorCodes;
