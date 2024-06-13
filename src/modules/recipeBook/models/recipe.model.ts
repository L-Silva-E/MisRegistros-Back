import { RecipeIngredientModel } from "./recipe.ingredient.model";
import { RecipeStepModel } from "./step.model";

export interface RecipeModel {
  id: number;
  name: string;
  description: string;
  score: number;
}

export interface RecipeCountModel {
  count: number;
  recipes: RecipeModel[];
}

export interface FullRecipeModel extends RecipeModel {
  ingredients: RecipeIngredientModel[];
  steps?: RecipeStepModel[];
}
