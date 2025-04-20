import winston from "winston";
import path from "path";
import fs from "fs";

const logDir: string = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

interface LogLevels {
  error: number;
  warn: number;
  info: number;
  http: number;
  debug: number;
  [key: string]: number;
}

const levels: LogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors: Record<keyof LogLevels, string> = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message} ${
        info.metadata ? JSON.stringify(info.metadata) : ""
      }`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json()
);

const maxSize = 5242880; // 5MB
const logger = winston.createLogger({
  level: process.env.API_ENV === "production" ? "info" : "debug",
  levels,
  format: fileFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: maxSize,
      maxFiles: 5,
    }),

    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: maxSize,
      maxFiles: 5,
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
      maxsize: maxSize,
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

if (process.env.API_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

export default logger;
