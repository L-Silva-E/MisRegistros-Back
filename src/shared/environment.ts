import { IformatEnvironments } from "./types.environment";

const environments: IformatEnvironments = {
  API_KEY: process.env.API_KEY || "MISSING_API_KEY",
  API_URL: process.env.API_URL || "http://localhost:9000",
  API_PORT: parseInt(process.env.API_PORT || "9000"),
  API_VERSION: process.env.API_VERSION || "v1",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "5432"),
  DB_USERNAME: process.env.DB_USERNAME || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_DATABASE: process.env.DB_DATABASE || "postgres",
};

export default environments;
