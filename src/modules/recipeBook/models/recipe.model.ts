import { BaseEntity } from "../../../shared/interfaces/base.entity";
import { RecipeIngredientModel } from "./recipe.ingredient.model";

//~ Base
export interface RecipeModel extends BaseEntity {
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

//~ Extra
export interface FullRecipeModel extends RecipeModel {
  ingredients: RecipeIngredientModel[];
  steps?: RecipeStepModel[];
}

//~ Step in Recipe context
export interface RecipeStepModel {
  number: number;
  instruction: string;
}

export interface RecipeStepInput {
  number?: number;
  instruction: string;
}
