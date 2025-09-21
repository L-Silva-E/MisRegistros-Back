import { BaseEntity } from "../../../shared/interfaces/base.entity";
import { RecipeIngredientInput } from "./recipe.ingredient.model";

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
  ingredients: RecipeIngredientInput[];
  steps?: RecipeStepModel[];
}

//~ For API responses with populated relations
export interface FullRecipeResponse extends RecipeModel {
  category: { name: string };
  origin: { name: string };
  ingredients: {
    quantity: number;
    ingredient: { id: number; name: string; unit: string };
  }[];
  steps: { number: number; instruction: string }[];
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
