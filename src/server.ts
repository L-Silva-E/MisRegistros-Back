import "./shared/config";
import app from "./shared/app";
import environment from "./shared/environment";
import logger from "./config/logger";

//* Routers
//~ RecipeBook Model
import CategoryRouter from "./modules/recipeBook/routes/category.routes";
import IngredientRouter from "./modules/recipeBook/routes/ingredient.routes";
import OriginRouter from "./modules/recipeBook/routes/origin.routes";
import RecipeRouter from "./modules/recipeBook/routes/recipe.routes";
import StepRouter from "./modules/recipeBook/routes/step.routes";

//~ Feature Model
import FeatureRouter from "./modules/feature/routes/feature.routes";

//* Init all Routers
async function init() {
  const version = environment.API_VERSION;

  logger.debug(`Starting server on version '${version}'`);

  try {
    //~ Init all routers
    const application = new app(
      [
        new CategoryRouter(version),
        new IngredientRouter(version),
        new OriginRouter(version),
        new RecipeRouter(version),
        new StepRouter(version),
        new FeatureRouter(version),
      ],
      environment.API_PORT
    );

    await application.listen();

    logger.debug(
      `Server is running on port: ${environment.API_PORT} in '${environment.API_ENV}' mode`
    );
  } catch (error) {
    logger.error("Error starting server", {
      metadata: {
        error: (error as Error).message,
        stack: (error as Error).stack,
      },
    });
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Promise Rejection", {
    metadata: {
      reason: reason.toString(),
      stack: reason.stack,
    },
  });
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", {
    metadata: {
      error: error.message,
      stack: error.stack,
    },
  });

  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

init();
