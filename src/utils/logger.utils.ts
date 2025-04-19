import logger from "../config/logger";

interface LogContext {
  [key: string]: any;
}

interface DatabaseLogDetails {
  [key: string]: any;
}

interface AuthLogDetails {
  [key: string]: any;
}

export const logError = (error: Error, context: LogContext = {}): void => {
  logger.error(`${error.message}`, {
    metadata: {
      ...context,
      stack: error.stack,
      name: error.name,
      code: (error as any).code,
    },
  });
};

export const logDatabase = (
  operation: string,
  entity: string,
  details: DatabaseLogDetails = {}
): void => {
  logger.debug(`DB ${operation.toUpperCase()} en ${entity}`, {
    metadata: {
      operation,
      entity,
      ...details,
    },
  });
};

export const logAuth = (
  userId: string | null,
  action: string,
  details: AuthLogDetails = {}
): void => {
  logger.info(`AUTH ${action}`, {
    metadata: {
      userId,
      action,
      ...details,
    },
  });
};
