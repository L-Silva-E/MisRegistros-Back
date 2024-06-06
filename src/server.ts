import app from "./shared/app";
import environment from "./shared/environment";

// ~ Routers
import IngredientRouter from "./modules/recipeBook/routes/ingredient.routes";
import RecipeRouter from "./modules/recipeBook/routes/recipe.routes";
import StepRouter from "./modules/recipeBook/routes/step.routes";

async function init() {
  const version = environment.API_VERSION;

  // ~ Init all routers
  // ~ RecipeBook Model
  await new app(
    [
      new IngredientRouter(version),
      new RecipeRouter(version),
      new StepRouter(version),
    ],
    environment.API_PORT
  ).listen();
}

init();
