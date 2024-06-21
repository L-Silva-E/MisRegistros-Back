import { IBaseModel } from "../../../shared/interfaces/Ibase.model";

// ~ Base
export interface IngredientModel extends IBaseModel {
  name: string;
  unit: string;
}

export interface IngredientCountModel {
  count: number;
  ingredients: IngredientModel[];
}
