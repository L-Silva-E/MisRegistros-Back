import { IformatEnvironments } from "./types.environment";

const environments: IformatEnvironments = {
  APP_KEY: process.env.APP_KEY || "MISSING_APP_KEY",
  APP_URL: process.env.APP_URL || "http://localhost:9000",
  APP_PORT: parseInt(process.env.APP_PORT || "9000"),
  APP_VERSION: process.env.APP_VERSION || "v1",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "5432"),
  DB_USERNAME: process.env.DB_USERNAME || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_DATABASE: process.env.DB_DATABASE || "postgres",
};

export default environments;
