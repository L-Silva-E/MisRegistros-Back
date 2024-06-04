import app from "./shared/app";
import environment from "./shared/environment";

// ~ Routers
import RecipeRouter from "./modules/recipeBook/routes/recipe.routes";
import IngredientRouter from "./modules/recipeBook/routes/ingredient.routes";

async function init() {
  const version = environment.API_VERSION;

  // ~ Init all routers
  // ~ RecipeBook Model
  await new app(
    [new RecipeRouter(version), new IngredientRouter(version)],
    environment.API_PORT
  ).listen();
}

init();
