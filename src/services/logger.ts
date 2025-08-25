import logger from "../config/logger";

export default class LoggerService {
  constructor(private entity: string) {}

  info(action: string, metadata = {}) {
    logger.info("", {
      entity: this.entity,
      action,
      metadata,
    });
  }

  error(action: string, metadata: Record<string, any> = {}) {
    logger.error("", {
      entity: this.entity,
      action,
      metadata: { ...metadata },
    });
  }
}
