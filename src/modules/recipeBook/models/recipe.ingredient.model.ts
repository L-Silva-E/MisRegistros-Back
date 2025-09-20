import { BaseEntity } from "../../../shared/interfaces/base.entity";

//~ Base
export interface RecipeIngredientModel extends BaseEntity {
  quantity: number;
}

//~ Input for creating/updating recipes with ingredient data
export interface RecipeIngredientInput {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}
