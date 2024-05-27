import app from "./shared/app";
import environment from "./shared/environment";

// ~ Routers
import RecipeRouter from "./modules/recipes/routes/recipe.routes";

async function init() {
  const version = environment.API_VERSION;

  // ~ Init all routers
  await new app([new RecipeRouter(version)], environment.API_PORT).listen();
}

init();
