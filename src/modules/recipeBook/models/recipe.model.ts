import { IBaseModel } from "../../../shared/interfaces/Ibase.model";
import { RecipeIngredientModel } from "./recipe.ingredient.model";
import { RecipeStepModel } from "./step.model";

// ~ Base
export interface RecipeModel extends IBaseModel {
  idCategory: number;
  idOrigin: number;
  name: string;
  description: string;
  thumbnail?: string | null;
  score: number;
  time: number;
  servings: number;
}

export interface RecipeCountModel {
  count: number;
  recipes: RecipeModel[];
}

// ~ Extra
export interface FullRecipeModel extends RecipeModel {
  ingredients: RecipeIngredientModel[];
  steps?: RecipeStepModel[];
}
