export interface IngredientModel {
  count?: number;
  id: number;
  name: string;
  unit: string;
}

export interface IngredientCountModel {
  count: number;
  ingredients: IngredientModel[];
}
