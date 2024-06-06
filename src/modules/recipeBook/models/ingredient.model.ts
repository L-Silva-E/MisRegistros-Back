export interface IngredientModel {
  id: number;
  name: string;
  unit: string;
}

export interface IngredientCountModel {
  count: number;
  ingredients: IngredientModel[];
}
