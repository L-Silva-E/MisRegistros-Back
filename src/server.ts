import app from "./shared/app";
import environment from "./shared/environment";

// ~ Routers
import RecipeRouter from "./modules/recipe/infrastructure/api/routes/recipe.router";

async function init() {
  const version = environment.APP_VERSION;

  // ~ Init all routers
  await new app([new RecipeRouter(version)], environment.APP_PORT).listen();
}

init();
