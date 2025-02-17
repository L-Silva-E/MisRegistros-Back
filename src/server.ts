import "./shared/config";
import app from "./shared/app";
import environment from "./shared/environment";

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

  //~ Init all routers
  await new app(
    [
      new CategoryRouter(version),
      new IngredientRouter(version),
      new OriginRouter(version),
      new RecipeRouter(version),
      new StepRouter(version),
      new FeatureRouter(version),
    ],
    environment.API_PORT
  ).listen();
}

init();
