import { BaseEntity } from "../../../shared/interfaces/base.entity";

//~ Base
export interface IngredientModel extends BaseEntity {
  name: string;
  unit: string;
}

export interface IngredientCountModel {
  count: number;
  ingredients: IngredientModel[];
}
